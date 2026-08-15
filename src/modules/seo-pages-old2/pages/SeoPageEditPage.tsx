import { useParams } from "react-router-dom";
import EditorShell from "../components/editor/EditorShell";
import type { SeoPageEditorProps } from "../types";

type Props = Omit<SeoPageEditorProps, "mode" | "pageId">;

export default function SeoPageEditPage(props: Props) {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="p-6 text-red-600">Page ID is missing.</div>;
  }

  return <EditorShell mode="edit" pageId={id} {...props} />;
}
