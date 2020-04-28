import React, { useRef, useEffect } from 'react';
import { Form } from '@unform/web';
import './App.css';
import Input from './components/form/input';
import { Scope } from '@unform/core';
import * as Yup from 'yup';


function App() {
  const formRef = useRef(null);
  useEffect(() => {
    setTimeout(() => {
      formRef.current.setData({
        name: 'Rafael Scholant',
        email: 'rafael.scholant@gmail.com'
      })
    }, 2000);
  }, [])
  async function handleSubmit(data, { reset }) {
    /*if (data.name === "") {
      formRef.current.setFieldError('name', 'O Nome é obrigatório')
      formRef.current.setErrors({
        name: 'O Nome é obrigatório',
        address: {
          city: 'A Cidade é obrigatória'
        }
      })
    }*/
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('O e-mail é obrigatório'),
        address: Yup.object().shape({
          city: Yup.string()
            .min(3, 'No mínimo 3 caracteres')
            .required('A cidade é obrigatória'),
        }),
      });
      await schema.validate(data, {
        abortEarly: false,
      });
      console.log(data);
      formRef.current.setErrors({});
      reset();
    } catch (err) {
      if (err instanceof Yup.ValidationError){
        const errorMessages = {};

        err.inner.forEach(error => {
          errorMessages[error.path] = error.message;
        })
        formRef.current.setErrors(errorMessages);
      }
    }
  }
  return (
    <div className="App">
      <h1>Hello World</h1>

      <Form ref={formRef}  onSubmit={handleSubmit}>
        <Input name="name" />
        <Input type="email" name="email" />
        <Input type="password" name="password" />
        <Scope path="address">
          <Input name="street" />
          <Input name="neighborhood" />
          <Input name="city" />
          <Input name="state" />
          <Input name="number" />
        </Scope>
        <button type="submit">Enviar</button>
      </Form>
    </div>
  );
}

export default App;
