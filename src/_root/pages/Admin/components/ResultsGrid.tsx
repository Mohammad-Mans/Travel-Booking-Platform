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
import DeleteIcon from "@mui/icons-material/Delete";

type Column = {
  field: keyof City;
  headerName: string;
};

type City = {
  id: number;
  name: string;
  description: string;
};

type ResultsGridProps = {
  data: City[];
  columnHeaders: Column[];
  onUpdate: (updatedEntity: any) => void;
  onDelete: (entity: any) => void;
  onChangePage: (pageNumber: number, pageSize: number) => void;
  totalCount: number;
};

const ResultsGrid: FC<ResultsGridProps> = ({
  data,
  columnHeaders,
  onUpdate,
  onDelete,
  totalCount,
  onChangePage,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [rowToDelete, setRowToDelete] = useState<number | null>(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const handleRowClick = (entity: any) => {
    setSelectedEntity(entity);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleUpdate = (updatedEntity: any) => {
    onUpdate(updatedEntity);
    closeDrawer();
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

            <TableBody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => handleRowClick(row)}
                  >
                    {columnHeaders.map((column) => (
                      <TableCell key={`${row.id}-${column.field}`}>
                        {row[column.field]}
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
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={columnHeaders.length + 1}>
                    No data were found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {data.length > 0 && (
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
                      rowsPerPageOptions={[4, 6, 8, 10]}
                    />
                  </TableCell>
                </TableRow>
              </TableFooter>
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
