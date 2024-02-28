import { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TableFooter,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import DeleteIcon from "@mui/icons-material/DeleteOutline";

interface Column {
  field: keyof Hotel | keyof City | keyof Room;
  headerName: string;
};

interface ResultsGridProps {
  dataType: string;
  data: (City | Hotel | Room)[];
  columnHeaders: Column[];
  onUpdate: (selectedRow: any) => void;
  onDelete: (selectedRowID: number | null) => void;
  onChangePage: (pageNumber: number, pageSize: number) => void;
  totalCount: number;
};

const ResultsGrid: FC<ResultsGridProps> = ({
  dataType,
  data,
  columnHeaders,
  onUpdate,
  onDelete,
  totalCount,
  onChangePage,
}) => {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [rowToDelete, setRowToDelete] = useState<number | null>(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const handleRowClick = (row: any) => {
    onUpdate(row);
  };

  const handleDelete = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setRowToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleChangePageNumber = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
    onChangePage(newPage + 1, pageSize);
  };

  const handleChangePageSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setPageNumber(0);
    onChangePage(1, newPageSize);
  };

  return (
    <>
      <Box sx={{ textAlign: "center" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columnHeaders.map((column) => (
                  <TableCell key={column.field}>{column.headerName}</TableCell>
                ))}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            {data.length > 0 ? (
              <>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow
                      key={index}
                      hover
                      onClick={() => handleRowClick(row)}
                    >
                      {columnHeaders.map((column) => (
                        <TableCell key={`${row.id}-${column.field}`}>
                          {dataType === "cities" &&
                            (row as City)[column.field as keyof City]}
                          {dataType === "hotels" &&
                            (row as Hotel)[column.field as keyof Hotel]}
                          {dataType === "rooms" &&
                            (row as Room)[column.field as keyof Room]}
                        </TableCell>
                      ))}

                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={(e) => handleDelete(row.id, e)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={columnHeaders.length + 1}>
                      <TablePagination
                        component="div"
                        count={totalCount}
                        page={pageNumber}
                        onPageChange={handleChangePageNumber}
                        rowsPerPage={pageSize}
                        onRowsPerPageChange={handleChangePageSize}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                      />
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={columnHeaders.length + 1}>
                    No data were found
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this row?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will delete this row permanently. You cannot undo this action.
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            color="black"
            variant="outlined"
            onClick={() => {
              setOpenDeleteDialog(false);
              setRowToDelete(null);
            }}
          >
            Keep it
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setOpenDeleteDialog(false);
              onDelete(rowToDelete);
            }}
            autoFocus
          >
            Delete row
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResultsGrid;
