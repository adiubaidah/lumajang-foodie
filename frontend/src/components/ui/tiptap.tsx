import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Toolbar } from "./toolbar";
import { useEffect } from "react";

export default function Tiptap({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: string;
  placeholder?: string;
  onChange: (richText: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2],
          HTMLAttributes: {
            class: "text-2xl font-bold",
          },
        },

        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-6",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-6",
          },
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: defaultValue || null,
    editorProps: {
      attributes: {
        class:
          "w-full px-5 py-4 rounded-lg border border-black focus:outline-0 h-[250px] overflow-y-auto",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });


  useEffect(() => {
    if (defaultValue) {
      editor?.commands.insertContent(defaultValue);
    }
  }, [defaultValue, editor]);

  return (
    <div className="min-h-[250px] ">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
