import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function BasicCard({
  title = "",
  body = "",
  actionHandler = () => {},
}) {
  return (
    <Card sx={{ minWidth: 100 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h2" component="h2">
          {body}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={actionHandler}>
          View All
        </Button>
      </CardActions>
    </Card>
  );
}
