import React, { useEffect } from "react";
import {
  TextField,
  FormControl,
  NativeSelect,
  InputLabel,
} from "@mui/material";

export default function Form({
  config = [],
  formData,
  setFormData,
  setValid = () => {},
}) {
  const handleChange = (e) => {
    const {
      target: { name, value },
    } = e;
    const tempFormData = { ...formData, [name]: value };

    validateForm(tempFormData);

    setFormData(tempFormData);
  };

  const validateForm = (formData) => {
    const isValid = config.every(({ id }) => !!formData?.[id]);
    setValid(isValid);
  };

  // initially set select values
  useEffect(() => {
    const defaultValue = {};
    config
      .filter((data) => data?.type === "select")
      .map(({ id, options }) => {
        defaultValue[id] = options[0]?.value || "";
      });
    const data = {
      ...formData,
      ...defaultValue,
    };
    validateForm(data);
    setFormData(data);
  }, []);

  return (
    <div>
      {config?.map(
        ({ id, label, type = "text", multiline = false, options = [] }) => {
          if (type === "select") {
            return (
              <FormControl fullWidth>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  {label}
                </InputLabel>
                <NativeSelect
                  onChange={handleChange}
                  value={formData?.[id] || ""}
                  name={id}
                  inputProps={{
                    id: "uncontrolled-native",
                  }}
                >
                  {options.map(({ value, label }, index) => (
                    <option value={value} key={index}>
                      {label}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            );
          }
          return (
            <TextField
              key={id}
              autoFocus
              margin="dense"
              id={id}
              label={label}
              multiline={multiline}
              type={type}
              name={id}
              fullWidth
              variant="standard"
              onChange={handleChange}
              value={formData?.[id] || ""}
            />
          );
        }
      )}
    </div>
  );
}
