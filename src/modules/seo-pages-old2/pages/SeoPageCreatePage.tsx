import EditorShell from "../components/editor/EditorShell";
import type { SeoPageEditorProps } from "../types";

type Props = Omit<SeoPageEditorProps, "mode" | "pageId">;

export default function SeoPageCreatePage(props: Props) {
  return <EditorShell mode="create" {...props} />;
}
