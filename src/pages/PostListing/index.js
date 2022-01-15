import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Pagination,
  IconButton,
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Collapse,
  styled,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Alert,
  Skeleton,
} from "@mui/material";
import {
  deletePost,
  postPostsByUser,
  updatePost,
  getCommentsByPost,
} from "../../services";
import Form from "../../components/Form";
import { useParams, useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchBar from "../../components/SearchBar";
import NoData from "../../components/NoData";
import { useDispatch, useSelector } from "react-redux";
import { getPostsAPI } from "../../reducers/post";
import { getCommentsAPI } from "../../reducers/comment";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function PostListing() {
  const MODAL_TYPE = {
    ADD: "ADD",
    EDIT: "EDIT",
  };

  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState(MODAL_TYPE.ADD);
  const [formData, setFormData] = useState({});
  const [expanded, setExpanded] = useState(null);
  const [isValid, setValid] = useState(false);

  const urlParams = useParams();
  const [search] = useSearchParams();
  const { data: listData, loading } = useSelector((state) => state.post);
  const { data: commentsData, loading: commentsLoading } = useSelector(
    (state) => state.comment
  );
  const dispatch = useDispatch();

  useEffect(() => {
    loadData();
  }, [page, search]);

  useEffect(() => {
    if (expanded !== null) {
      const postId = listData?.data?.[expanded]?.id;
      dispatch(getCommentsAPI(postId));
    }
  }, [expanded]);

  const loadData = () => {
    const params = { title: search.get("title"), page: page + 1 };
    reset();

    return dispatch(getPostsAPI(urlParams?.userId, params));
  };

  const handleDelete = (id) => {
    deletePost(id).then(loadData);
  };

  const handleUpdate = () => {
    const { id } = formData;
    const payload = { ...formData };
    setOpen(false);

    updatePost(id, payload).then(loadData);
  };

  const handleCreate = () => {
    setOpen(false);

    postPostsByUser(urlParams?.userId, {
      ...formData,
    }).then(loadData);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const reset = () => {
    setExpanded(null);
    setFormData({});
  };

  const FORM_CONFIG = [
    {
      id: "title",
      label: "Title",
    },
    {
      id: "body",
      label: "Body",
      multiline: true,
    },
  ];

  return (
    <div>
      <SearchBar
        title={"title"}
        actionName={"Add Post"}
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
              <Skeleton variant="rectangular" width={"100%"} height={200} />
            </ListItem>
          ))
        ) : listData?.data?.length ? (
          listData?.data?.map((data, index) => {
            const { id, title, body } = data;
            return (
              <>
                <ListItem alignItems="flex-start">
                  <Card
                    sx={{
                      minWidth: "100%",
                    }}
                  >
                    <CardHeader title={title} />
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {body}
                      </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          setModalType(MODAL_TYPE.EDIT);
                          setOpen(true);
                          setFormData({ ...data });
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDelete(id)}
                      >
                        <DeleteOutlineIcon color="error" />
                      </IconButton>
                      <ExpandMore
                        expand={expanded === index}
                        onClick={() =>
                          setExpanded((prevIndex) =>
                            prevIndex !== index ? index : null
                          )
                        }
                        aria-expanded={expanded === index}
                        aria-label="show more"
                      >
                        <ExpandMoreIcon />
                      </ExpandMore>
                    </CardActions>
                    <Collapse
                      in={expanded === index}
                      timeout="auto"
                      unmountOnExit
                    >
                      <CardContent>
                        <Typography paragraph>Comments:</Typography>
                        <List
                          sx={{
                            width: "100%",
                            bgcolor: "background.paper",
                          }}
                        >
                          {commentsLoading ? (
                            Array.from(Array(5)).map((_, index) => (
                              <ListItem key={index}>
                                <Skeleton
                                  variant="rectangular"
                                  width={"100%"}
                                  height={50}
                                />
                              </ListItem>
                            ))
                          ) : commentsData?.data?.length ? (
                            commentsData?.data?.map(
                              ({ name, email, body }, index) => {
                                return (
                                  <>
                                    {" "}
                                    {index !== 0 && <Divider component="li" />}
                                    <ListItem alignItems="flex-start">
                                      <ListItemText
                                        primary={`${name} - ${email}`}
                                        secondary={
                                          <React.Fragment>
                                            {body}
                                          </React.Fragment>
                                        }
                                      />
                                    </ListItem>
                                  </>
                                );
                              }
                            )
                          ) : (
                            <NoData />
                          )}
                        </List>
                      </CardContent>
                    </Collapse>
                  </Card>
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
          {modalType === MODAL_TYPE.ADD ? "Add Post" : "Update Post"}
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

export default PostListing;
