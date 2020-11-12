import React, { useState, useEffect } from "react";
import axios from "axios";
import * as Yup from "yup";
import Input from "./Input";

function Form() {
  //managing state for our form inputs, This is adding that value
  const defaultState = {
    name: "",
    email: "",
    // gender: "",
    password: "",
    terms: false,
  };

  const [formState, setFormState] = useState(defaultState);

  //Setting up errors
  const [errors, setErrors] = useState({ ...defaultState, terms: "" });

  //Setting up Button state
  const [buttonDisabled, setButtonDisabled] = useState(true);

  //formState Schema, this is form  validation
  let formSchema = Yup.object().shape({
    name: Yup.string().required("Your name is required"),
    email: Yup.string()
      .required("Please provide an email")
      .email("This is not a valid email"),
    password: Yup.string().required("Password is required"),
    terms: Yup.boolean().oneOf([false], "Your consent is required"),
  });
  //

  useEffect(() => {
    formSchema.isValid(formState).then((valid) => setButtonDisabled(valid));
  }, [formState]);

  //onSubmit
  const formSubmit = (e) => {
    e.preventDefault();
    console.log("Form was successfully submitted");
    axios
      .post("https://reqres.in/api/users", formState)
      .then(() => console.log("form submitted success"))
      .catch((err) => console.log(err));
  };

  //OnChange-- I would like clarity on this
  const inputChange = (e) => {
    console.log("input changed!", e.target.value);
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState({
      ...formState,
      [e.target.name]: value,
    });
    validateChange(e);
  };

  //Validation//
  const validateChange = (e) => {
    Yup.reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then((valid) => {
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((error) =>
        setErrors({
          ...errors,
          [e.target.name]: error.errors[0],
        })
      );
  };

  return (
    <>
      <form onSubmit={formSubmit}>
        <Input
          name="name"
          type="text"
          onChange={inputChange}
          value={formState.name}
          label="Name"
          errors={errors}
        />
        <br></br>
        <Input
          name="email"
          type="text"
          onChange={inputChange}
          value={formState.email}
          label="Email"
          errors={errors}
        />

        <br></br>
        <Input
          name="password"
          type="password"
          onChange={inputChange}
          value={formState.password}
          label="Password"
          errors={errors}
        />
        <br></br>
        {/* <label htmlFor="gender" onChange={inputChange}>
          Gender
          <select name="gender" id="gender">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="trans">Trans</option>
            <option value="nonBinary">Non-Binary</option>
            <option value="notListed">Not Listed</option>
          </select>
        </label> */}

        <label htmlFor="terms">
          Terms and Conditions
          <input
            name="terms"
            type="checkbox"
            onChange={inputChange}
            errors={errors}
          />
        </label>

        {/* <label htmlFor="email">
          Email
          <input
            
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            name="password"
            type="text"
            onChange={inputChange}
            value={formState.password}
          />
        </label> */}
        {/* <label htmlFor="terms">
          Password
          <input
            name="terms"
            type="text"
            onChange={inputChange}
            value={formState.terms}
          />
        </label> */}
        <br></br>
        <button disabled={buttonDisabled}>Submit</button>
      </form>
    </>
  );
}

export default Form;
//Try and have second password for confirm, https://til.hashrocket.com/posts/vahuw4phan-check-the-password-confirmation-with-yup
