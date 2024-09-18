import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TablePagination,
  TableRow,
  Paper,
  TableHead,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import './CustomTable.css'; // Import the CSS file

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const CustomTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (code) => {
    setSelectedCode(code);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCode('');
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  return (
    <>
      <TableContainer component={Paper} style={{ height: '55vh', display: 'flex', flexDirection: 'column' }}>
        <Table sx={{ minWidth: 500, flex: '1 1 auto' }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell className="table-head" sx={{ height: 50 }}>S.No</TableCell>
              <TableCell className="table-head" sx={{ height: 50 }}>Topic</TableCell>
              <TableCell className="table-head" sx={{ height: 50 }}>SubTopic</TableCell>
              <TableCell className="table-head" sx={{ height: 50 }}>Title</TableCell>
              <TableCell className="table-head" sx={{ height: 50 }}>Code</TableCell>
              <TableCell className="table-head" sx={{ height: 50 }}>Language</TableCell>
              <TableCell className="table-head" sx={{ height: 50 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', opacity: 0.8 }}>
                  No problems solved
                </TableCell>
              </TableRow>
            ) : (
              (rowsPerPage > 0
                ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data
              ).map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }}>{index + 1}</TableCell>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }}>{row.topic}</TableCell>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }}>{row.subTopic}</TableCell>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }}>{row.title}</TableCell>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }}>
                    <span
                      style={{ color: 'blue', cursor: 'pointer' }}
                      onClick={() => handleClickOpen(row.code)}
                    >
                      code
                    </span>
                  </TableCell>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }}>{row.language}</TableCell>
                  <TableCell sx={{ height: 30, fontSize: '0.875rem' }} className={row.status === 'Passed' ? 'status-passed' : ''}>
                    {row.status}
                  </TableCell>
                </TableRow>
              ))
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 30 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page',
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: 'blue' }}>Code</DialogTitle>
        <DialogContent>
          <pre>{selectedCode}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

CustomTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      sNo: PropTypes.number.isRequired,
      topic: PropTypes.string.isRequired,
      subTopic: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      language: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CustomTable;