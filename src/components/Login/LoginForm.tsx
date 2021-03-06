import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import {
  FormControl,
  Input,
  Button,
  FormLabel,
  Divider,
  Heading,
  Box,
  FormErrorMessage,
  Spinner,
} from "@chakra-ui/core";
import { Link } from "react-router-dom";
import { UserContext, SAVE_TOKEN } from "../../services/UserContext";

// Enlace del server backend, guardado en las variables de entorno.
const localapi = process.env.REACT_APP_ROOT_API;
// Enlace de login
const loginUri = `${localapi}users/login`;

// Formulario de login, se encarga de enviar credenciales al server y recibir token
const LoginForm: React.FC = () => {
  const { dispatch } = useContext(UserContext);

  const { register, handleSubmit, errors, formState, setError } = useForm();

  const [isFormLoading, setFormLoadingState] = useState(false);

  // Peticion al server, guarda token en UserContext, para ser manejado por LoginWrapper
  const onSubmit = handleSubmit(({ email, password }) => {
    setFormLoadingState(true);
    axios
      .request({
        url: loginUri,
        method: "POST",
        data: { email, password },
      })
      .then((res: any) => {
        dispatch({ type: SAVE_TOKEN, payload: res.data.token });
      })
      .catch((err: AxiosError) => {
        setError("email", {
          message: "El email o la contraseña son invalidos",
        });
        // eslint-disable-next-line no-console
        console.log(err);
      })
      .finally(() => setFormLoadingState(false));
  });
  return (
    <Box>
      <Box textAlign="center">
        <Heading as="h3">Iniciar Sesión</Heading>
      </Box>
      <Divider />
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={errors.email || errors.password}>
          {errors && errors.email && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            ref={register({
              required: "Este campo es requerido.",
            })}
          />
          <FormLabel htmlFor="password">Contraseña</FormLabel>
          <Input
            type="password"
            name="password"
            ref={register({
              required: "Este campo es requerido.",
            })}
          />
          <Box
            mt={4}
            width="100%"
            display="flex"
            flexDirection="row-reverse"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variantColor="teal"
              isLoading={formState.isSubmitting}
              type="submit"
            >
              {isFormLoading ? <Spinner size="md" /> : "Enviar"}
            </Button>
            <Button variant="link" variantColor="teal">
              <Link to="/register">Registrarse</Link>
            </Button>
          </Box>
        </FormControl>
      </form>
    </Box>
  );
};

export default LoginForm;
