import React from "react";
import { styled, Button, Grid, alpha, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useSearchParams } from "react-router-dom";
import { debounce } from "../../helpers/debounce";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function SearchBar({ title = "q", actionHandler = () => {}, actionName = "" }) {
  const [search, setSearch] = useSearchParams();

  return (
    <Grid container justifyContent="space-between" spacing={{ xs: 2, md: 3 }}>
      <Grid item xs={2} sm={4} md={4}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            onChange={debounce(
              ({ target: { value } }) => setSearch({ [title]: value }),
              500
            )}
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
      </Grid>
      <Grid item>
        <Button
          onClick={actionHandler}
          variant="contained"
          startIcon={<AddIcon />}
        >
          {actionName}
        </Button>
      </Grid>
    </Grid>
  );
}

export default SearchBar;
