import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  Pagination,
  IconButton,
  ListItemText,
  Checkbox,
  ListItemIcon,
  ListItemButton,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  Alert,
  DialogActions,
  Button,
} from "@mui/material";
import { postTodosByUser, updateTodo, deleteTodo } from "../../services";
import Form from "../../components/Form";
import { useParams, useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchBar from "../../components/SearchBar";
import NoData from "../../components/NoData";
import { useDispatch, useSelector } from "react-redux";
import { getTodosAPI } from "../../reducers/todo";

function TodoListing() {
  const STATUS = {
    PENDING: "pending",
    COMPLETED: "completed",
  };

  const MODAL_TYPE = {
    ADD: "ADD",
    EDIT: "EDIT",
  };

  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(MODAL_TYPE.ADD);
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState({});

  const [isValid, setValid] = useState(false);

  const urlParams = useParams();
  const [search] = useSearchParams();
  const { data: listData, loading } = useSelector((state) => state.todo);
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, [page, search]);

  const loadData = () => {
    const params = { title: search.get("title"), page: page + 1 };
    reset();

    return dispatch(getTodosAPI(urlParams?.userId, params));
  };

  const handleToggle = (id, isCompleted) => {
    const payload = { status: isCompleted ? STATUS.PENDING : STATUS.COMPLETED };

    updateTodo(id, payload).then(loadData);
  };

  const handleDelete = (id) => {
    deleteTodo(id).then(loadData);
  };

  const handleUpdate = () => {
    const { id } = formData;
    const payload = { ...formData };
    setOpen(false);

    updateTodo(id, payload).then(loadData);
  };

  const handleCreate = () => {
    setOpen(false);
    postTodosByUser(urlParams?.userId, {
      ...formData,
      status: "pending",
    }).then(loadData);
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
      id: "title",
      label: "Title",
    },
    {
      id: "due_on",
      label: "Due On",
      type: "date",
    },
  ];

  return (
    <div>
      <SearchBar
        title={"title"}
        actionName={"Add Todo"}
        actionHandler={() => {
          reset();
          setModalType(MODAL_TYPE.ADD);
          setOpen(true);
        }}
      />
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
        }}
      >
        {loading ? (
          Array.from(Array(20)).map((_, index) => (
            <ListItem key={index}>
              <Skeleton variant="rectangular" width={"100%"} height={40} />
            </ListItem>
          ))
        ) : listData?.data?.length ? (
          listData?.data?.map((data) => {
            const { id, title, status, due_on } = data;
            const isCompleted = status === STATUS.COMPLETED;
            const dueDate = new Date(due_on).toLocaleDateString();
            const dueDataForModal = dueDate?.split("/").reverse().join("-");
            return (
              <>
                <ListItem
                  key={id}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        onClick={() => {
                          setModalType(MODAL_TYPE.EDIT);
                          setOpen(true);
                          setFormData({ ...data, due_on: dueDataForModal });
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(id)}
                      >
                        <DeleteOutlineIcon color="error" />
                      </IconButton>
                    </>
                  }
                  disablePadding
                >
                  <ListItemButton
                    role={undefined}
                    onClick={() => handleToggle(id, isCompleted)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={isCompleted}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ "aria-labelledby": id }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      style={{
                        textDecoration: isCompleted ? "line-through" : "none",
                      }}
                      id={id}
                      primary={title}
                      secondary={dueDate}
                    />
                  </ListItemButton>
                </ListItem>
              </>
            );
          })
        ) : (
          <NoData />
        )}
      </List>
      <Pagination
        onChange={(_, page) => setPage(page)}
        count={listData?.meta?.pagination?.pages || 0}
      />

      {/* DIALOG BOX */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {modalType === MODAL_TYPE.ADD ? "Add Todo" : "Update Todo"}
        </DialogTitle>
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
          {modalType === MODAL_TYPE.ADD ? (
            <Button onClick={handleCreate} disabled={!isValid}>
              Create
            </Button>
          ) : (
            <Button onClick={handleUpdate} disabled={!isValid}>
              Update
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TodoListing;
