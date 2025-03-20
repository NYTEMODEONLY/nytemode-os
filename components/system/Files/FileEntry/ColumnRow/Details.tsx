import { memo } from "react";
import type { FC } from "react";

type DetailsProps = {
  date?: string;
  size?: string;
  type?: string;
  width?: number;
};

const Details: FC<DetailsProps> = ({ date, size, type, width }) => (
  <>
    {date && <div style={{ width }}>{date}</div>}
    {type && <div style={{ width }}>{type}</div>}
    {size && <div style={{ width }}>{size}</div>}
  </>
);

export default memo(Details);
