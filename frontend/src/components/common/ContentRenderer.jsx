"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return url;
  let optimized = url
    .replace(/\/q_\d+/, "")
    .replace(/\/f_auto/, "")
    .replace(/\/w_auto/, "")
    .replace(/\/dpr_auto/, "");
  return optimized.replace(
    "/upload/",
    "/upload/q_auto:good,f_auto,w_auto,dpr_auto,c_limit/",
  );
};

const BlogImage = ({ src, alt, className, ...props }) => {
  const [imgSrc] = useState(optimizeCloudinaryUrl(src));
  const [loaded, setLoaded] = useState(false);
  const cleaned = className
    ? className.replace(/border(-\S+)?/g, "").trim()
    : "";
  return (
    <div
      className={`relative my-6 rounded-xl overflow-hidden transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${cleaned}`}
    >
      <Image
        src={imgSrc}
        alt={alt || ""}
        width={0}
        height={0}
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        onLoadingComplete={() => setLoaded(true)}
        {...props}
      />
    </div>
  );
};

const parseStyles = (styleString) => {
  if (!styleString) return {};
  return styleString.split(";").reduce((acc, style) => {
    const parts = style.split(":");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(":").trim();
      const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      acc[camel] = value;
    }
    return acc;
  }, {});
};

// Tailwind class map per tag
const TAG_CLASSES = {
  p: "text-base leading-[1.8] mb-4 text-gray-600 font-inter",
  h1: "text-3xl font-bold mt-10 mb-5 text-brand-primary-hover font-inter",
  h2: "text-2xl font-bold mt-8 mb-4 text-brand-primary-hover font-inter",
  h3: "text-xl font-bold mt-7 mb-3 text-brand-primary-hover font-inter",
  h4: "text-lg font-bold mt-6 mb-3 text-brand-primary-hover font-inter",
  h5: "text-base font-bold mt-5 mb-2 text-brand-primary-hover font-inter",
  h6: "text-sm font-bold mt-4 mb-2 text-brand-primary-hover font-inter",
  ul: "list-disc ml-5 mb-4 pl-2 text-gray-600 font-inter",
  ol: "list-decimal ml-5 mb-4 pl-2 text-gray-600 font-inter",
  li: "text-base leading-relaxed mb-1 text-gray-600 pl-1 font-inter",
  blockquote:
    "border-l-4 border-amber-400 pl-5 py-3 my-6 bg-amber-50 rounded-r-lg italic text-gray-500 font-inter",
  strong: "font-semibold text-gray-700",
  b: "font-semibold text-gray-700",
  em: "italic",
  i: "italic",
  u: "underline decoration-gray-400 underline-offset-4",
  a: "text-[#2D4A3E] hover:text-[#1e3329] hover:underline transition-colors font-medium",
  hr: "my-8 border-0 border-t border-gray-200",
  table:
    "border-collapse w-full my-6 border border-gray-200 rounded-lg overflow-hidden text-sm",
  thead: "bg-white",
  tbody: "bg-white",
  tr: "border-b border-gray-100 hover:bg-white transition-colors",
  th: "px-4 py-3 text-left font-semibold text-gray-700 bg-white border-b border-gray-200 whitespace-nowrap",
  td: "px-4 py-3 text-gray-600 border-b border-gray-100",
};

const ContentRenderer = ({ content }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const parseHTML = (html) => {
    if (!html?.trim()) return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const convert = (node, key) => {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      if (node.nodeType !== Node.ELEMENT_NODE) return null;

      const tag = node.tagName.toLowerCase();
      const children = Array.from(node.childNodes).map((c, i) => convert(c, i));
      const props = { key };
      const baseClass = TAG_CLASSES[tag] || "";

      // Collect attributes
      Array.from(node.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name === "class") {
          props.className = `${baseClass} ${attr.value}`.trim();
        } else if (name === "style") {
          props.style = parseStyles(attr.value);
        } else if (name === "colspan") {
          props.colSpan = attr.value;
        } else if (name === "rowspan") {
          props.rowSpan = attr.value;
        } else if (
          [
            "id",
            "title",
            "alt",
            "src",
            "href",
            "target",
            "width",
            "height",
            "allow",
            "allowfullscreen",
          ].includes(name)
        ) {
          props[name] = attr.value;
        }
      });

      if (!props.className && baseClass) props.className = baseClass;

      // Image
      if (tag === "img") return <BlogImage key={key} {...props} />;

      // Table scroll wrapper
      if (tag === "table") {
        return (
          <div key={key} className="overflow-x-auto max-w-full my-6">
            {React.createElement(tag, props, ...children)}
          </div>
        );
      }

      // Links
      if (tag === "a" && props.href) {
        const isInternal =
          props.href.startsWith("/") ||
          props.href.includes(
            process.env.NEXT_PUBLIC_SITE_URL || "umarella.org",
          );
        props.rel = isInternal ? "dofollow" : "noopener noreferrer nofollow";
        props.target = isInternal ? undefined : "_blank";
      }

      // iframes
      if (tag === "iframe") {
        return (
          <div
            key={key}
            className="relative w-full overflow-hidden rounded-xl my-6 aspect-video bg-white shadow-sm border border-gray-100"
          >
            {React.createElement(
              tag,
              { ...props, className: "absolute top-0 left-0 w-full h-full" },
              ...children,
            )}
          </div>
        );
      }

      return React.createElement(tag, props, ...children);
    };

    return Array.from(doc.body.childNodes).map((n, i) => convert(n, i));
  };

  if (!isClient) return null;

  return (
    <div className="w-full max-w-none font-inter">{parseHTML(content)}</div>
  );
};

export default ContentRenderer;
