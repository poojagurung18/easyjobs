"use client";
import React, {
  useEffect,
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import TextAlign from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Minus,
  Undo,
  Redo,
  PlusSquare,
  Trash2,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Grid3x3,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

const TiptapTextBlock = forwardRef(
  ({ value, onChange, onImageUpload }, ref) => {
    const DEFAULT_RENDERER_COLOR = "#374151"; // matches ContentRenderer's text-gray-700
    const BRAND_COLOR = "#0ea5e9";
    const [showTableMenu, setShowTableMenu] = useState(false);
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);
    const [showAlignMenu, setShowAlignMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [showLinkInput, setShowLinkInput] = useState(false);

    // Bubble Menu States
    const [bubbleLinkUrl, setBubbleLinkUrl] = useState("");
    const [showBubbleLinkInput, setShowBubbleLinkInput] = useState(false);
    const [showBubbleHeadingMenu, setShowBubbleHeadingMenu] = useState(false);
    const [showBubbleAltInput, setShowBubbleAltInput] = useState(false);
    const [showBubbleColorMenu, setShowBubbleColorMenu] = useState(false);
    const [bubbleAltText, setBubbleAltText] = useState("");

    const [isInitialized, setIsInitialized] = useState(false);

    const fileInputRef = useRef(null);

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
        }),
        TextStyle,
        Color,
        Underline,
        Blockquote,
        HorizontalRule,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: "text-blue-400 underline" },
        }),
        Placeholder.configure({
          placeholder: "Enter the content here...",
        }),
        Image.configure({
          HTMLAttributes: {
            class: "rounded-lg max-w-full h-auto my-4",
          },
        }),
        BubbleMenuExtension,
      ],
      content: "",
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class:
            "w-full min-h-[450px] outline-none border border-slate-200 rounded-b-xl p-6 bg-white text-foreground leading-relaxed font-mukta tiptap-editor ProseMirror",
        },
      },
      onUpdate: ({ editor }) => {
        if (onChange) {
          onChange(editor.getHTML());
        }
      },
      onSelectionUpdate: () => {
        // Logic handled by BubbleMenu component now
      },
    });

    // Initial content load only
    useEffect(() => {
      if (editor && value !== editor.getHTML()) {
        editor.commands.setContent(value || "");
      }
    }, [value, editor]);

    // Expose clear method to parent component
    useImperativeHandle(ref, () => ({
      clear: () => {
        if (editor) {
          editor.commands.clearContent();
          setIsInitialized(false);
          // Re-enable updates after a short delay
          setTimeout(() => setIsInitialized(true), 100);
        }
      },
      setContent: (content) => {
        if (editor) {
          editor.commands.setContent(content || "");
          setIsInitialized(true);
        }
      },
    }));

    const setLink = () => {
      if (!linkUrl) return;
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    };

    const setBubbleLink = () => {
      if (!bubbleLinkUrl) return;
      editor.chain().focus().setLink({ href: bubbleLinkUrl }).run();
      setBubbleLinkUrl("");
      setShowBubbleLinkInput(false);
    };

    const setBubbleAlt = () => {
      if (editor.isActive("image")) {
        editor
          .chain()
          .focus()
          .updateAttributes("image", { alt: bubbleAltText })
          .run();
      }
      setShowBubbleAltInput(false);
    };

    const toggleBubbleHeading = () => {
      setShowBubbleHeadingMenu((v) => !v);
      setShowBubbleLinkInput(false);
      setShowBubbleAltInput(false);
      setShowBubbleColorMenu(false);
    };

    const toggleBubbleLink = () => {
      setShowBubbleLinkInput(!showBubbleLinkInput);
      setShowBubbleHeadingMenu(false);
      setShowBubbleAltInput(false);
      setShowBubbleColorMenu(false);
    };

    const toggleBubbleColor = () => {
      setShowBubbleColorMenu(!showBubbleColorMenu);
      setShowBubbleHeadingMenu(false);
      setShowBubbleLinkInput(false);
      setShowBubbleAltInput(false);
    };

    const toggleBubbleAlt = () => {
      if (!showBubbleAltInput) {
        setBubbleAltText(editor.getAttributes("image").alt || "");
      }
      setShowBubbleAltInput(!showBubbleAltInput);
      setShowBubbleLinkInput(false);
      setShowBubbleHeadingMenu(false);
      setShowBubbleColorMenu(false);
    };

    const handleImageClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
      const file = event.target.files?.[0];
      if (file) {
        // If onImageUpload callback is provided, use it to upload to server
        if (onImageUpload) {
          try {
            const imageUrl = await onImageUpload(file);
            if (imageUrl) {
              editor
                .chain()
                .focus()
                .setImage({ src: imageUrl, alt: file.name })
                .run();
            }
          } catch (error) {
            console.error("Image upload failed:", error);
            // Fallback to base64 if upload fails
            uploadAsBase64(file);
          }
        } else {
          // Fallback to base64 encoding
          uploadAsBase64(file);
        }
      }
      event.target.value = "";
    };

    const uploadAsBase64 = (file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        if (url) {
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        }
      };
      reader.readAsDataURL(file);
    };

    if (!editor) return null;

    const activeTextColor = editor.getAttributes("textStyle").color;
    const normalizedActiveColor =
      typeof activeTextColor === "string" &&
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(activeTextColor)
        ? activeTextColor
        : DEFAULT_RENDERER_COLOR;

    const presetColors = [
      "#ffffff",
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#fbbf24",
      "#60a5fa",
      "#f87171",
    ];

    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: "none" }}
        />

        <style jsx global>{`
          .tiptap-editor h1 {
            font-size: 2.25rem;
            color: var(--foreground) !important;
            font-weight: 800;
            margin: 1.5rem 0 1rem;
          }
          .tiptap-editor h2 {
            font-size: 1.85rem;
            color: var(--foreground) !important;
            font-weight: 700;
            margin: 1.25rem 0 0.875rem;
          }
          .tiptap-editor h3 {
            font-size: 1.5rem;
            color: var(--foreground) !important;
            font-weight: 600;
            margin: 1.125rem 0 0.75rem;
          }
          .tiptap-editor p {
            margin: 0.75rem 0;
            color: var(--foreground) !important;
          }
          .tiptap-editor img {
            max-width: 100%;
            border-radius: 0.75rem;
            border: 1px solid #29354d;
            margin: 1.5rem auto;
            display: block;
          }
          .tiptap-editor img.ProseMirror-selectednode {
            outline: 3px solid var(--primary);
            outline-offset: 4px;
          }
          .tiptap-editor ul {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 1rem 0;
            color: var(--foreground) !important;
          }
          .tiptap-editor ol {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 1rem 0;
            color: var(--foreground) !important;
          }
          .tiptap-editor blockquote {
            border-left: 4px solid var(--primary);
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            background: #10192a;
            font-style: italic;
            color: #cbd5e1;
            border-radius: 0 0.5rem 0.5rem 0;
          }
          .tiptap-editor table {
            border-collapse: collapse;
            width: 100%;
            margin: 1.5rem 0;
            border: 1px solid #29354d;
            border-radius: 0.5rem;
            overflow: hidden;
          }
          .tiptap-editor th,
          .tiptap-editor td {
            border: 1px solid #29354d;
            padding: 0.75rem;
            min-width: 100px;
            color: var(--foreground) !important;
          }
          .tiptap-editor th {
            background-color: #10192a;
            font-weight: 700;
            text-align: left;
            color: var(--foreground) !important;
          }
          .tiptap-editor hr {
            border: none;
            border-top: 2px solid #29354d;
            margin: 2rem 0;
          }
          .tiptap-editor a {
            color: var(--primary);
            text-decoration: underline;
            text-underline-offset: 2px;
          }
          /* Custom scrollbar for editor */
          .tiptap-editor::-webkit-scrollbar {
            width: 8px;
          }
          .tiptap-editor::-webkit-scrollbar-track {
            background: #060b13;
          }
          .tiptap-editor::-webkit-scrollbar-thumb {
            background: #1b263b;
            border-radius: 4px;
          }
          .tiptap-editor::-webkit-scrollbar-thumb:hover {
            background: #29354d;
          }
          /* Placeholder styling */
          .tiptap-editor p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #576785;
            pointer-events: none;
            height: 0;
          }
        `}</style>

        <div className="w-full flex flex-col border border-slate-200 rounded-xl shadow-sm relative bg-white">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 bg-gray-50 p-3 border-b border-gray-200 text-gray-600 relative z-[50]">
            {/* Heading Dropdown (H1 - H6) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHeadingMenu(!showHeadingMenu)}
                className="p-2 rounded-lg flex items-center gap-1 hover:bg-gray-100 text-gray-600 transition-all font-medium"
              >
                <Heading2 size={18} />
                <ChevronDown size={12} />
              </button>

              {showHeadingMenu && (
                <div className="absolute z-[9999] top-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-2 min-w-[160px] animate-in fade-in zoom-in duration-200 flex flex-col gap-1">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level }).run();
                        setShowHeadingMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors mb-0 ${
                        editor.isActive("heading", { level })
                          ? "bg-brand-primary text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Heading {level}
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      editor.chain().focus().setParagraph().run();
                      setShowHeadingMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      editor.isActive("paragraph")
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Normal Text
                  </button>
                </div>
              )}
            </div>

            <Divider />

            {/* Color Picker */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowColorMenu(!showColorMenu);
                  setShowHeadingMenu(false);
                  setShowAlignMenu(false);
                  setShowTableMenu(false);
                }}
                className="p-2 rounded-lg flex items-center gap-1 hover:bg-gray-100 text-gray-600 transition-all relative"
              >
                <Palette size={18} />
                <div
                  className="w-4 h-1 absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    backgroundColor:
                      normalizedActiveColor || DEFAULT_RENDERER_COLOR,
                  }}
                />
              </button>

              {showColorMenu && (
                <div className="absolute z-[9999] top-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-2 grid grid-cols-5 gap-1 min-w-[180px] animate-in fade-in zoom-in duration-200">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().setColor(color).run();
                        setShowColorMenu(false);
                      }}
                      className={`w-6 h-6 rounded-full border border-slate-200 transition-transform hover:scale-110 ${
                        (normalizedActiveColor || "").toLowerCase() ===
                        color.toLowerCase()
                          ? "ring-2 ring-brand-primary ring-offset-1"
                          : ""
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <div className="col-span-5 flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        className="w-6 h-6 rounded border border-slate-200 cursor-pointer p-0"
                        value={normalizedActiveColor || DEFAULT_RENDERER_COLOR}
                        onInput={(e) => {
                          editor.chain().focus().setColor(e.target.value).run();
                        }}
                      />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {normalizedActiveColor || DEFAULT_RENDERER_COLOR}
                      </span>
                    </div>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        editor.chain().focus().unsetColor().run();
                        setShowColorMenu(false);
                      }}
                      className="text-[10px] text-slate-400 hover:text-brand-primary font-medium text-left mt-0"
                    >
                      Reset to Default
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              icon={<Bold size={18} />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              icon={<Italic size={18} />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              icon={<span className="font-bold underline text-sm">U</span>}
            />

            <Divider />

            <div className="relative">
              <ToolbarButton
                onClick={() => setShowLinkInput(!showLinkInput)}
                active={editor.isActive("link")}
                icon={<Link2 size={18} />}
              />
              {showLinkInput && (
                <div className="absolute z-50 top-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-4 min-w-[320px] animate-in fade-in zoom-in duration-200">
                  <input
                    type="url"
                    placeholder="Paste or type a link..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setLink()}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm mb-3 bg-gray-100 text-foreground outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-sans"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={setLink}
                      className="flex-1 bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-brand-primary-hover transition-colors shadow-sm"
                    >
                      Apply Link
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setShowLinkInput(false);
                      }}
                      className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-sm text-slate-500 font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Divider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              icon={<List size={18} />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              icon={<ListOrdered size={18} />}
            />

            <Divider />

            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setShowAlignMenu(!showAlignMenu);
                  setShowHeadingMenu(false);
                  setShowColorMenu(false);
                  setShowTableMenu(false);
                }}
                className={`p-2 rounded-lg flex items-center gap-1 transition-all ${
                  showAlignMenu ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                <AlignLeft size={18} />
                <ChevronDown size={12} />
              </button>
              {showAlignMenu && (
                <div className="absolute z-[9999] top-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-2 min-w-[180px] animate-in fade-in zoom-in duration-200 flex flex-col gap-1">
                  <AlignButton
                    onClick={() => {
                      editor.chain().focus().setTextAlign("left").run();
                      setShowAlignMenu(false);
                    }}
                    active={editor.isActive({ textAlign: "left" })}
                    icon={<AlignLeft size={16} />}
                    label="Align Left"
                  />
                  <AlignButton
                    onClick={() => {
                      editor.chain().focus().setTextAlign("center").run();
                      setShowAlignMenu(false);
                    }}
                    active={editor.isActive({ textAlign: "center" })}
                    icon={<AlignCenter size={16} />}
                    label="Align Center"
                  />
                  <AlignButton
                    onClick={() => {
                      editor.chain().focus().setTextAlign("right").run();
                      setShowAlignMenu(false);
                    }}
                    active={editor.isActive({ textAlign: "right" })}
                    icon={<AlignRight size={16} />}
                    label="Align Right"
                  />
                </div>
              )}
            </div>

            <Divider />

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              icon={<Quote size={18} />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              icon={<Minus size={18} />}
            />

            <Divider />

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTableMenu(!showTableMenu)}
                className={`p-2 rounded-lg flex items-center gap-1 transition-all ${editor.isActive("table") ? "bg-[#31473E] text-white shadow-sm" : "text-slate-600 hover:bg-slate-200/50"}`}
              >
                <Grid3x3 size={18} />
                <ChevronDown size={12} />
              </button>
              {showTableMenu && (
                <div className="absolute z-50 top-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-2 min-w-[220px] grid grid-cols-1 gap-1 animate-in fade-in zoom-in duration-200">
                  <TableMenuBtn
                    onClick={() => {
                      editor
                        .chain()
                        .focus()
                        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                        .run();
                      setShowTableMenu(false);
                    }}
                    icon={<PlusSquare size={14} />}
                    label="Insert 3x3 Table"
                  />
                  <div className="my-1 border-t border-slate-100" />
                  <TableMenuBtn
                    onClick={() =>
                      editor.chain().focus().addColumnAfter().run()
                    }
                    label="Add Column After"
                  />
                  <TableMenuBtn
                    onClick={() => editor.chain().focus().addRowAfter().run()}
                    label="Add Row After"
                  />
                  <TableMenuBtn
                    onClick={() => editor.chain().focus().deleteColumn().run()}
                    label="Delete Column"
                    className="text-rose-500"
                  />
                  <TableMenuBtn
                    onClick={() => editor.chain().focus().deleteRow().run()}
                    label="Delete Row"
                    className="text-rose-500"
                  />
                  <div className="my-1 border-t border-slate-100" />
                  <TableMenuBtn
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTableMenu(false);
                    }}
                    icon={<Trash2 size={14} />}
                    label="Delete Table"
                    className="text-rose-600 font-bold hover:bg-rose-50"
                  />
                </div>
              )}
            </div>

            <Divider />
            <ToolbarButton
              onClick={handleImageClick}
              icon={<ImageIcon size={18} />}
            />
            <Divider />
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              icon={<Undo size={18} />}
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              icon={<Redo size={18} />}
            />
          </div>

          {/* Bubble Menu */}
          <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100, zIndex: 100000 }}
            className="bg-white text-slate-700 rounded-xl shadow-2xl p-1.5 flex items-center gap-1 border border-slate-200"
          >
            {/* Bubble Menu: Headings Dropdown */}
            <div className="relative">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggleBubbleHeading()}
                className={`p-2 rounded-lg flex items-center gap-1 transition-all ${
                  showBubbleHeadingMenu
                    ? "bg-slate-200"
                    : "hover:bg-slate-200/50"
                }`}
              >
                <Heading2 size={16} />
                <ChevronDown size={10} />
              </button>
              {showBubbleHeadingMenu && (
                <div className="absolute bottom-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-1 min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-200">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().toggleHeading({ level }).run();
                        setShowBubbleHeadingMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors mb-0.5 ${
                        editor.isActive("heading", { level })
                          ? "bg-brand-primary text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      Heading {level}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      editor.chain().focus().setParagraph().run();
                      setShowBubbleHeadingMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${
                      editor.isActive("paragraph")
                        ? "bg-brand-primary text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    Normal Text
                  </button>
                </div>
              )}
            </div>

            <div className="w-[1px] h-5 bg-gray-700 mx-1" />

            <BubbleButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              icon={<Bold size={16} />}
            />
            <BubbleButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              icon={<Italic size={16} />}
            />

            <div className="w-[1px] h-5 bg-gray-700 mx-1" />

            {/* Bubble Menu: Link Input */}
            <div className="relative">
              <BubbleButton
                onClick={toggleBubbleLink}
                active={editor.isActive("link")}
                icon={<Link2 size={16} />}
              />
              {showBubbleLinkInput && (
                <div className="absolute bottom-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-3 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
                  <input
                    type="url"
                    placeholder="Link URL"
                    value={bubbleLinkUrl}
                    onChange={(e) => setBubbleLinkUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && setBubbleLink()}
                    className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm mb-2 bg-slate-50 text-slate-800 outline-none focus:border-[#31473E]/30"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={setBubbleLink}
                      className="flex-1 bg-[#31473E] text-white px-2 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#25362f]"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        editor.chain().focus().unsetLink().run();
                        setShowBubbleLinkInput(false);
                      }}
                      className="px-2 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bubble Menu: Image Alt Attribute Editor (Shown only if image selected) */}
            {editor.isActive("image") ? (
              <>
                <div className="w-[1px] h-5 bg-gray-700 mx-1" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleBubbleAlt}
                    title="Edit Image Alt Text"
                    className={`p-1.5 rounded-lg flex items-center gap-1 transition-all ${
                      showBubbleAltInput ? "bg-slate-100" : "hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                      ALT
                    </span>
                  </button>
                  {showBubbleAltInput && (
                    <div className="absolute bottom-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-3 min-w-[280px] animate-in fade-in slide-in-from-top-2 duration-200">
                      <input
                        type="text"
                        placeholder="Image description..."
                        value={bubbleAltText}
                        onChange={(e) => setBubbleAltText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && setBubbleAlt()}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm mb-2 bg-slate-50 text-slate-800 outline-none"
                      />
                      <button
                        type="button"
                        onClick={setBubbleAlt}
                        className="w-full bg-[#31473E] text-white px-2 py-1.5 rounded-lg text-xs font-semibold"
                      >
                        Save Description
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-[1px] h-5 bg-gray-700 mx-1" />
                {/* Bubble Menu: Color Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={toggleBubbleColor}
                    className={`p-2 rounded-lg flex items-center gap-1 transition-all relative ${
                      showBubbleColorMenu
                        ? "bg-slate-100"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <Palette size={16} color={activeTextColor || "#475569"} />
                    <div
                      className="w-3.5 h-0.5 absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        backgroundColor: normalizedActiveColor,
                      }}
                    />
                  </button>

                  {showBubbleColorMenu && (
                    <div className="absolute bottom-12 left-0 bg-white border border-slate-200 shadow-xl rounded-xl p-3 grid grid-cols-5 gap-2 min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-200">
                      {presetColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            editor.chain().focus().setColor(color).run();
                            setShowBubbleColorMenu(false);
                          }}
                          className={`w-7 h-7 rounded-full border shadow-sm transition-transform hover:scale-110 ${normalizedActiveColor.toLowerCase() === color.toLowerCase() ? "border-slate-400 ring-2 ring-[#31473E] ring-offset-1" : "border-slate-200"}`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <div className="col-span-5 flex flex-col gap-1 mt-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0"
                            value={normalizedActiveColor}
                            onInput={(e) =>
                              editor
                                .chain()
                                .focus()
                                .setColor(e.target.value)
                                .run()
                            }
                          />
                          <span className="text-[10px] uppercase font-mono text-slate-400">
                            {normalizedActiveColor}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            editor.chain().focus().unsetColor().run();
                            setShowBubbleColorMenu(false);
                          }}
                          className="text-[10px] text-slate-400 hover:text-[#31473E] font-bold text-left mt-1"
                        >
                          RESET
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </BubbleMenu>

          <EditorContent editor={editor} />
        </div>
      </>
    );
  },
);

TiptapTextBlock.displayName = "TiptapTextBlock";

/* Helper Components */
const ToolbarButton = ({ onClick, active, icon }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`p-2 rounded-lg transition-all ${active ? "bg-[#31473E] text-white shadow-md scale-105" : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"}`}
  >
    {icon}
  </button>
);

const BubbleButton = ({ onClick, active, icon }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`p-2 rounded-lg transition-all ${active ? "bg-[#31473E] text-white shadow-sm" : "hover:bg-slate-100 text-slate-600"}`}
  >
    {icon}
  </button>
);

const AlignButton = ({ onClick, active, icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 rounded-lg w-full text-left transition-colors font-medium ${active ? "bg-[#31473E] text-white shadow-sm" : "text-slate-600"}`}
  >
    {icon} {label}
  </button>
);

const TableMenuBtn = ({ onClick, label, icon, className = "" }) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    className={`flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 rounded-lg text-left transition-colors font-medium text-slate-600 ${className}`}
  >
    {icon} {label}
  </button>
);

const Divider = () => <div className="w-[1px] h-6 bg-slate-200 mx-1" />;

export default TiptapTextBlock;
