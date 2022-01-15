import React, { useEffect, useState } from "react";
import TableComponent from "../../components/Table";
import { getPostsByUser, getTodosByUser } from "../../services";
import BasicCard from "../../components/Card";
import { Grid, Typography, Box, Skeleton } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

function Dashboard() {
  const [cardData, setCardData] = useState({});
  const currentUser = useSelector((state) => state.user.currentUser);
  const [loading, setLoading] = useState(false);

  const urlParams = useParams();
  const navigate = useNavigate();

  const CARD_DATA = [
    {
      title: "No of Posts",
      id: "post",
      actionHandler: () => {
        navigate(`/posts/${currentUser?.id}`);
      },
    },
    {
      title: "No of Todos",
      id: "todo",
      actionHandler: () => {
        navigate(`/todos/${currentUser?.id}`);
      },
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getPostsByUser(urlParams?.userId),
      getTodosByUser(urlParams?.userId),
    ])
      .then(([post, todo]) => {
        const data = {
          post: post?.meta?.pagination?.total,
          todo: todo?.meta?.pagination?.total,
        };

        setCardData(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <Typography variant="h5" component="h5">
        Hi {currentUser?.name || ""},
      </Typography>

      <Typography paragraph color="text.secondary">
        {currentUser?.email || ""}
      </Typography>
      <Box sx={{ marginTop: "60px" }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {loading
            ? Array.from(Array(2)).map((_, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <Skeleton variant="rectangular" width={"100%"} height={200} />
                </Grid>
              ))
            : CARD_DATA.map(({ title, id, actionHandler }, index) => (
                <Grid item xs={2} sm={4} md={4} key={index}>
                  <BasicCard
                    title={title}
                    body={cardData?.[id] || "0"}
                    actionHandler={actionHandler}
                  />
                </Grid>
              ))}
        </Grid>
      </Box>
    </div>
  );
}

export default Dashboard;
