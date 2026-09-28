import type { Element, ElementContent, Root as HastRoot } from "hast"
import type { PhrasingContent, Root as MdastRoot, RootContent } from "mdast"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { isWidgetName, widgets } from "@/components/widgets/registry"
import { slugify } from "@/lib/slug"
import { cn } from "@/lib/utils"

const CITATION = /\[(?=[^\]]*(?:L\d|p\.|pp\.|Chapter|Flanagan|Boden|Ayala|Harris|Turing|Tomasello|Damasio|Luria|Bray|Haugeland|Bermúdez|announcement|bank|discussion))[^\[\]]+\]/g

function citationNodes(value: string): PhrasingContent[] {
  const out: PhrasingContent[] = []
  let last = 0
  for (const m of value.matchAll(CITATION)) {
    const start = m.index ?? 0
    if (start > last) out.push({ type: "text", value: value.slice(last, start) })
    out.push({ type: "emphasis", data: { hName: "cite" }, children: [{ type: "text", value: m[0].slice(1, -1) }] })
    last = start + m[0].length
  }
  if (last < value.length) out.push({ type: "text", value: value.slice(last) })
  return out
}

function remarkCitations() {
  const walk = (node: MdastRoot | RootContent) => {
    if (!("children" in node)) return
    const children: RootContent[] = []
    for (const child of node.children as RootContent[]) {
      if (child.type === "text" && CITATION.test(child.value)) {
        CITATION.lastIndex = 0
        children.push(...citationNodes(child.value))
      } else {
        walk(child)
        children.push(child)
      }
    }
    ;(node as { children: RootContent[] }).children = children
  }
  return (tree: MdastRoot) => walk(tree)
}

function textOf(node: ElementContent | HastRoot | undefined): string {
  if (!node) return ""
  if (node.type === "text") return node.value
  if ("children" in node) return node.children.map((c) => textOf(c as ElementContent)).join("")
  return ""
}

function widgetName(pre: Element | undefined) {
  const code = pre?.children[0]
  if (code?.type !== "element" || code.tagName !== "code") return null
  const cls = code.properties?.className
  if (!Array.isArray(cls) || !cls.includes("language-widget")) return null
  const name = textOf(code).trim()
  if (!isWidgetName(name)) throw new Error(`unknown widget: ${name}`)
  return name
}

const components: Components = {
  h2: ({ node, children }) => (
    <h2
      id={slugify(textOf(node))}
      className="mt-14 mb-4 scroll-mt-24 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0"
    >
      {children}
    </h2>
  ),
  h3: ({ node, children }) => (
    <h3 id={slugify(textOf(node))} className="mt-8 mb-3 scroll-mt-24 text-lg font-semibold">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="leading-7 not-first:mt-4">{children}</p>,
  ul: ({ children }) => <ul className="my-4 ml-5 list-disc space-y-2 marker:text-muted-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 ml-5 list-decimal space-y-3 marker:text-muted-foreground">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-7 [&>p]:mt-0">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  cite: ({ children }) => (
    <cite className="mx-0.5 inline rounded bg-muted px-1.5 py-0.5 font-mono text-[0.72rem] text-muted-foreground not-italic">
      {children}
    </cite>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-lg border-l-4 border-primary bg-primary/5 px-4 py-3 [&>p]:mt-0">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => {
    const external = href?.startsWith("http")
    return (
      <a
        href={href}
        className="font-medium underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {children}
      </a>
    )
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-muted/60 text-left">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 font-medium whitespace-nowrap">{children}</th>,
  td: ({ children }) => <td className="border-t px-3 py-2 align-top leading-6">{children}</td>,
  code: ({ children }) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">{children}</code>,
  pre: ({ node, children }) => {
    const name = widgetName(node)
    if (name) {
      const Widget = widgets[name]
      return <Widget />
    }
    return <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm">{children}</pre>
  },
}

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("text-[0.975rem] text-foreground/90", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkCitations]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
