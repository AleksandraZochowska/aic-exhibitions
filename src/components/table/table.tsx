import { useState } from "react";
import { ExhibitionList } from "../../App";
import "./table.scss";

// Component returning exhibition Description cells to populate table body
const Description: React.FC<{ content: string; trIndex: number }> = ({ content, trIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // helper function to toggle length of exhibition description (expanded vs. collapsed)
  const toggleIsExpanded: (e: React.MouseEvent) => void = (e) => {
    setIsExpanded(!isExpanded);
    e.currentTarget.classList.toggle("row__td-description--expanded");
  };

  return (
    <td key={`tr${trIndex}description`} data-column={"Description"} className="row__td-description" onClick={(e) => toggleIsExpanded(e)}>
      {isExpanded ? content : content.slice(0, 200) + "..."}
      <span onClick={(e) => toggleIsExpanded(e)} className="expand-button">
        {isExpanded ? " SHOW LESS" : " ...READ MORE"}
      </span>
    </td>
  );
};

// Component returning Table with chosen data received from API
const Table: React.FC<{
  tableData: ExhibitionList;
  tableHeadings: string[];
  onHeadingClick: (e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>) => void;
}> = ({ tableHeadings, tableData, onHeadingClick }) => {
  // Head row of the table (column headings):
  const headings = (
    <tr>
      {tableHeadings.map((col, index) => (
        <th
          key={index}
          id={
            col === "Title"
              ? "title"
              : col === "Description"
              ? "description"
              : col === "Gallery"
              ? "gallery_title"
              : col === "Featured"
              ? "is_featured"
              : col === "Type of Exhibition"
              ? "type"
              : "unknown_heading"
          }
          // on click sort the table
          onClick={(e) => onHeadingClick(e)}
        >
          <h2>{col}</h2>
        </th>
      ))}
    </tr>
  );

  // Data to populate table body:
  const data = tableData.map((exhibitionData, trIndex) => {
    const { title, description, gallery_title, is_featured, type, status } = exhibitionData;

    // Cells to populate a single row:
    const cells = (
      <>
        <td key={`tr${trIndex}title`} data-column={"Title"}>
          {title ? title : "—"}
        </td>
        {description ? (
          <Description content={description} trIndex={trIndex} />
        ) : (
          <td key={`tr${trIndex}description`} data-column={"Description"} className="row__td-description">
            —
          </td>
        )}
        <td key={`tr${trIndex}gallerytitle`} data-column={"Gallery"}>
          {gallery_title ? gallery_title : "—"}
        </td>
        <td key={`tr${trIndex}isfeatured`} data-column={"Featured"}>
          {is_featured ? is_featured : "—"}
        </td>
        <td key={`tr${trIndex}type`} data-column={"Type of Exhibition"}>
          {type ? type : "—"}
        </td>
      </>
    );

    // Rows (with adequate class names, depending on whether the exhibition is closed or open) to populate the table:
    return status === "Closed" ? (
      <tr key={`tr${trIndex}`} className="table-body__row table-body__row--closed">
        {cells}
      </tr>
    ) : status === "Confirmed" ? (
      <tr key={`tr${trIndex}`} className="table-body__row table-body__row--open">
        {cells}
      </tr>
    ) : (
      <tr key={`tr${trIndex}`} className="table-body__row">
        {cells}
      </tr>
    );
  });

  // Return table:
  return (
    <div className="table-container">
      <table className="table-container__table">
        <thead className="table__head">{headings}</thead>
        <tbody className="table__body">{data}</tbody>
      </table>
    </div>
  );
};

export default Table;
