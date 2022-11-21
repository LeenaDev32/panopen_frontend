import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { Container } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

export default function CustomizedTables() {
  const [bookData, setBookData] = useState([]);
  const [editData, seteditData] = useState(null);
  const [editFormName, setEditFormName] = useState("");
  const [bookTime, setBookTime] = useState([]);

  const getCategory = async () => {
    const callApi = await axios("http://localhost:3000/users");
    setBookData(callApi.data);
  };
  const getBookData = async () => {
    const bookTime = await axios("http://localhost:3000/reading_times");
    setBookTime(bookTime.data);
  };
  const handleCategory = useCallback(() => {
    getCategory();
  }, []);
  const editName = async (id, name) => {
    await axios.patch(`http://localhost:3000/users/${id}`, {
      name: name,
    });
    seteditData(null);
    handleCategory();
  };
  useEffect(() => {
    getCategory();
    getBookData();
  }, []);

  return (
    <Container className="wrapper">
      <h1 className="top_head">Book Details</h1>
      <TableContainer component={Paper} className="table_data">
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>BookName</TableCell>
              <TableCell>Reading Time</TableCell>
              <TableCell></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {bookData
              .sort((a, b) => a.id - b.id)
              .map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    {editData !== row.id ? (
                      <>
                        <EditIcon
                          cursor="pointer"
                          onClick={() => seteditData(row?.id)}
                        />
                        <span>{row.name}</span>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          autoFocus
                          defaultValue={row.name}
                          onChange={(e) => setEditFormName(e.target.value)}
                        />
                        <CancelIcon
                          cursor="pointer"
                          onClick={() => seteditData(null)}
                        />
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    <span>{row.email}</span>
                  </TableCell>
                  <>
                    <TableCell>
                      {bookTime.find((o) => o.id === row.id)?.book_name}
                    </TableCell>
                    <TableCell>
                      {bookTime.find((o) => o.id === row.id)?.total_time}
                    </TableCell>
                  </>
                  <TableCell>
                    {editData === row.id && (
                      <Button
                        onClick={() => editName(row.id, editFormName)}
                        variant="contained"
                      >
                        Update
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
