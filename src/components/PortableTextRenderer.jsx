import React from 'react'
import { PortableText } from '@portabletext/react'

function SanityImage({ value }) {
  if (!value?.asset) return null
  const url = value.asset?.url || value.asset?._ref
  return (
    <figure style={{ margin: '2em 0' }}>
      <img
        src={url}
        alt={value.alt || ''}
        loading="lazy"
        style={{ width: '100%', borderRadius: '8px' }}
      />
      {value.caption && (
        <figcaption style={{ textAlign: 'center', fontSize: '0.85em', marginTop: '0.5em', color: 'var(--text-3)' }}>
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}

function CodeBlock({ value }) {
  return (
    <pre data-language={value.language || 'text'}>
      <code>{value.code}</code>
    </pre>
  )
}

const components = {
  types: {
    image: SanityImage,
    code: CodeBlock,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = value?.href?.startsWith('/') ? undefined : 'noopener noreferrer'
      const target = value?.blank ? '_blank' : value?.href?.startsWith('/') ? undefined : '_blank'
      return (
        <a href={value?.href} target={target} rel={rel}>
          {children}
        </a>
      )
    },
    code: ({ children }) => <code>{children}</code>,
  },
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => <h4>{children}</h4>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
}

export default function PortableTextRenderer({ value }) {
  if (!value) return null
  return (
    <div className="seo-content">
      <PortableText value={value} components={components} />
    </div>
  )
}
