import React from "react";
import styles from "./Table.module.scss";
import Text from "../Text/Text";
import InfiniteScroll from '../InfiniteScroll';

interface TableProps {
  columns: Array<any>;
  rows: Array<any>;
  variant?: string;
  headVariant?: string;
  type?: string;
  responsive?: boolean;
  hasPagination?: boolean;
  hasInfiniteScroll?: boolean;
  breakPoint?: string;
  containerClass?: string;
  headerClass?: string;
  tableClass?: string;
  bodyClass?: string;
  render?: Function;
  loadingContent?: React.ReactNode,
  onInfinite?: Function;
  children?: React.ReactNode;
  // More functionalities related to Table component can be implemented, as of now iam ignoring these functionalities.
  draggable?: boolean,
  onDrag?: Function,
  resizable?: boolean,
  onResize?: Function,
  columnsMeta?: any;
  fixedHeader?: boolean;
  fixedFooter?: boolean;
  footerItems?: Array<any>;
}

interface TableDataProps { children?: React.ReactNode; dataClass?: string }

// Helper functions

const getTableClass = (props: TableProps) => {
  const { variant, type, tableClass } = props;
  const typeClass = styles[`table-${type}`];
  const variantClass = styles[`table-${variant}`];
  return `${styles["table"]} ${typeClass} ${variantClass} ${tableClass}`;
};

const getContainerClass = (props: TableProps) => {
  const responsiveClass = props.responsive
    ? styles[`table-responsive${props.breakPoint}`]
    : "";
  return `${responsiveClass} ${props.containerClass}`;
};

const getHeaderClass = (props: TableProps) => {
  const headerClass = styles[`thead-${props.headVariant}`];
  return `${headerClass} ${props.headerClass}`;
};

const getBodyClass = (props: TableProps) => {
  return props.bodyClass;
};

const getLoadingTemplate = (props: TableProps) => {
  const { hasInfiniteScroll, onInfinite, loadingContent } = props;
  if (hasInfiniteScroll && onInfinite) {
    return <tr>
      <td colSpan={props.columns.length}>
        <InfiniteScroll onChange={(inView: boolean) => {
          if (inView) onInfinite(inView);
        }}>
          {loadingContent}
        </InfiniteScroll>
      </td>
    </tr>
  }
  return loadingContent;
};

// Components

const TableData = (props: TableDataProps) => {
  return <td className={props.dataClass}>{props.children}</td>;
};

const Table = (props: TableProps) => {
  const containerClass = getContainerClass(props);
  const tableClass = getTableClass(props);
  const headerClass = getHeaderClass(props);
  const bodyClass = getBodyClass(props);

  return (
    <div className={containerClass}>
      <table className={tableClass}>
        <thead className={headerClass}>
          <tr>
            {props.columns.map((item: any) => {
              let content = null;
              if (item.renderItem) {
                content = item.renderItem(item);
              } else if (item.hasSort) {
                content = (
                  <div className="d-flex">
                    <Text.H3>{item.label}</Text.H3>
                    <div className="ml-auto">
                      {/* We Can include a icon library and use its icons */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">
                        <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z" />
                        <path fillRule="evenodd" d="M10.082 12.629L9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z" />
                        <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                      </svg>
                    </div>
                  </div>
                );
              } else {
                content = <Text.H3>{item.label}</Text.H3>;
              }
              return <th key={item.key}>{content}</th>;
            })}
          </tr>
        </thead>
        <tbody className={bodyClass}>
          {props.rows.map((item: any) => {
            return <tr key={item.key}>{props.render && props.render(item)}</tr>;
          })}
          {getLoadingTemplate(props)}
        </tbody>
      </table>
    </div>
  );
};

Table.defaultProps = {
  columns: [],
  rows: [],
  responsive: false,
  breakPoint: '',
  type: 'striped',
  variant: "light",
  headVariant: "light",
  containerClass: "text-left",
  tableClass: '',
  headerClass: '',
  bodyClass: '',
};

Table.Data = TableData;

export default Table;
