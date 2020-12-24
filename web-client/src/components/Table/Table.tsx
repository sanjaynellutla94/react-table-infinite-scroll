import React, { useMemo } from "react";
import styles from "./Table.module.scss";
import Text from "../Text/Text";
import InfiniteScroll from "../InfiniteScroll";

type Variant = "light" | "dark" | "info" | "primary" | "danger" | "success";
type HeadVariant = "light" | "dark";
type TableType = "striped" | "bordered" | "borderless" | "hover";
interface TableProps {
  columns: Array<any>;
  rows: Array<any>;
  variant?: Variant;
  headVariant?: HeadVariant;
  type?: TableType;
  responsive?: boolean;
  hasInfiniteScroll?: boolean;
  breakPoint?: string;
  containerClass?: string;
  headerClass?: string;
  tableClass?: string;
  bodyClass?: string;
  render?: Function;
  loadingContent?: React.ReactNode;
  onInfinite?: Function;
  children?: React.ReactNode;
  // More functionalities related to Table component can be implemented, as of now iam ignoring these functionalities.
  draggable?: boolean;
  onDrag?: Function;
  resizable?: boolean;
  onResize?: Function;
  hasPagination?: boolean;
  columnsMeta?: any;
  fixedHeader?: boolean;
  fixedFooter?: boolean;
  footerItems?: Array<any>;
}

interface TableDataProps {
  children?: React.ReactNode;
  dataClass?: string;
}

// Helper functions

const getContainerClass = (props: TableProps) => {
  const responsiveClass = props.responsive
    ? styles[`table-responsive${props.breakPoint}`]
    : "";
  return `${responsiveClass} ${props.containerClass}`;
};

const getTableClass = (props: TableProps) => {
  const { variant, type, tableClass } = props;
  const typeClass = styles[`table-${type}`];
  const variantClass = styles[`table-${variant}`];
  return `${styles["table"]} ${typeClass} ${variantClass} ${tableClass}`;
};

const getHeaderClass = (props: TableProps) => {
  const headerClass = styles[`thead-${props.headVariant}`];
  return `${headerClass} ${props.headerClass}`;
};

const getBodyClass = (props: TableProps) => {
  return props.bodyClass;
};

// Template functions

const getColumnTemplate = (item: any) => {
  if (item.renderItem) {
    return item.renderItem(item);
  } else if (item.hasSort) {
    return (
      <div className="d-flex">
        <Text.H3>{item.label} (with dummy sort)</Text.H3>
        <div className="ml-auto">
          {/* We Can include a icon library and use its icons */}
          {/* Can make sorting dynamic by adding columnsMeta and assosiate right keys */}
          {/* This is dummy as of now */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-sort-alpha-down-alt"
            viewBox="0 0 16 16"
          >
            <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z" />
            <path
              fillRule="evenodd"
              d="M10.082 12.629L9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"
            />
            <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
          </svg>
        </div>
      </div>
    );
  }
  return <Text.H3>{item.label}</Text.H3>;
};

// Components

const TableData = (props: TableDataProps) => {
  return <td className={props.dataClass}>{props.children}</td>;
};

const Table = (props: TableProps) => {
  // Not using useMemo for all class utils because there are no heavy computations involved
  const containerClass = getContainerClass(props);
  const tableClass = getTableClass(props);
  const headerClass = getHeaderClass(props);
  const bodyClass = getBodyClass(props);

  const {
    hasInfiniteScroll,
    onInfinite,
    loadingContent,
    columns,
    rows,
    render,
  } = props;

  const columnsLength = columns.length;

  // Template functions

  // Using useMemo since InfiniteScroll component is involved.
  const loadingTemplate = useMemo(() => {
    if (hasInfiniteScroll && onInfinite) {
      return (
        <tr>
          <td colSpan={columnsLength}>
            <InfiniteScroll
              onChange={(inView: boolean) => {
                if (inView) onInfinite(inView);
              }}
            >
              {loadingContent}
            </InfiniteScroll>
          </td>
        </tr>
      );
    }
    return loadingContent;
  }, [hasInfiniteScroll, onInfinite, loadingContent, columnsLength]);

  // Render

  return (
    <div className={containerClass}>
      <table className={tableClass}>
        <thead className={headerClass}>
          <tr>
            {columns.map((item: any) => {
              return <th key={item.key}>{getColumnTemplate(item)}</th>;
            })}
          </tr>
        </thead>
        <tbody className={bodyClass}>
          {rows.map((item: any) => {
            return <tr key={item.key}>{render && render(item)}</tr>;
          })}
          {loadingTemplate}
        </tbody>
      </table>
    </div>
  );
};

Table.defaultProps = {
  columns: [],
  rows: [],
  responsive: false,
  breakPoint: "",
  type: "striped",
  variant: "light",
  headVariant: "light",
  containerClass: "text-left",
  tableClass: "",
  headerClass: "",
  bodyClass: "",
};

Table.Data = TableData;

export default Table;
