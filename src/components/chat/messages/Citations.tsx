import { Typography } from "@mui/joy";
import { useTranslation } from "../../../lib/i18n";
import { getUrlDomain, maxStringLength } from "../../../lib/util";
import ReferenceContainer from "../MessageReferences";

export interface Citation {
  link: string;
  title: string;
}

interface CitationsProps {
  citations: Citation[];
}

export function Citations({ citations }: CitationsProps) {
  const { t } = useTranslation();
  if (!citations || citations.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 px-4 py-3">
      <Typography>{t("sources")}</Typography>
      <div className="mt-2 flex flex-wrap gap-4">
        {citations.map((citation, index) => (
          <Citation citation={citation} index={index} key={index} />
        ))}
      </div>
    </div>
  );
}

interface CitationProps {
  citation: Citation;
  index: number;
}
export function Citation({ citation, index }: CitationProps) {
  const { title, link } = citation;
  const domain = getUrlDomain(link);
  return (
    <ReferenceContainer
      onClick={() => window.open(link, "_blank")}
      title={maxStringLength(title, 28)}
      subtitle={`${domain} • ${index + 1}`}
      icon={
        <img
          src={`https://icons.deingpt.com/icon?url=${link}&size=24..32..64`}
          alt={`${domain} icon`}
          width={20}
        />
      }
    />
  );
}
