import { useParams } from "react-router-dom";
import SeoPageEditor from "../components/SeoPageEditor";

export default function SeoPageEditPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div className="p-6 text-sm text-red-600">Page ID is missing.</div>;
  }

  return <SeoPageEditor mode="edit" pageId={id} />;
}
