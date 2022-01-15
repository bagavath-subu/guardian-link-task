import React, { useEffect, useState } from "react";
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import TableComponent from "../../components/Table";
import { createUser } from "../../services";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCurrentUser, getUsersAPI } from "../../reducers/user";
import Form from "../../components/Form";
import SearchBar from "../../components/SearchBar";
import { useDispatch, useSelector } from "react-redux";

function UserListing() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({});
  const [isValid, setValid] = useState(false);

  const navigate = useNavigate();
  const [search] = useSearchParams();
  const { data: tableData, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = () => {
    const params = { name: search.get("name"), page: page + 1 };
    reset();
    return dispatch(getUsersAPI(params));
  };

  const HEADERS = [
    { id: "name", label: "Name", minWidth: 170 },
    {
      id: "email",
      label: "Email",
      minWidth: 170,
    },
    { id: "gender", label: "Gender", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 100 },
  ];

  const handleCreate = () => {
    setOpen(false);

    return createUser({
      ...formData,
    }).then(loadData);
  };

  const handleClick = (row) => {
    dispatch(setCurrentUser(row));
    const { id } = row;
    navigate(`/dashboard/${id}`);
  };

  const reset = () => {
    setFormData({});
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const FORM_CONFIG = [
    {
      id: "name",
      label: "Name",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
    },
    {
      id: "gender",
      label: "Gender",
      type: "select",
      options: [
        {
          label: "Male",
          value: "male",
        },
        {
          label: "Female",
          value: "female",
        },
      ],
    },
    {
      id: "status",
      label: "Status",
      type: "select",
      options: [
        {
          label: "Active",
          value: "active",
        },
        {
          label: "Inactive",
          value: "inactive",
        },
      ],
    },
  ];

  return (
    <div>
      <Box sx={{ margin: "20px 0" }}>
        <Alert severity="info">
          <AlertTitle>Info</AlertTitle>
          Click on any user to get their info — <strong>check it out!</strong>
        </Alert>
      </Box>
      <SearchBar
        title={"name"}
        actionName={"Add User"}
        actionHandler={() => {
          reset();
          setOpen(true);
        }}
      />
      <TableComponent
        headers={HEADERS}
        meta={tableData?.meta}
        data={tableData?.data || []}
        page={page}
        setPage={setPage}
        clickHandler={handleClick}
        loading={loading}
      />

      {/* DIALOG BOX */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          {!isValid && (
            <Alert severity="error">Fields cannot be Empty!!!</Alert>
          )}
          <Form
            config={FORM_CONFIG}
            formData={formData}
            setFormData={setFormData}
            setValid={setValid}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!isValid}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserListing;
