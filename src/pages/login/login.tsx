import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectError,
  userLogin,
  selectIsAuthenticated
} from '../../services/slices/userSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const errorText = useSelector(selectError);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(
      userLogin({
        email,
        password
      })
    )
      .unwrap()
      .then(() => {
        if (isAuthenticated) {
          navigate('/');
        }
      });
  };

  return (
    <LoginUI
      errorText={errorText || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
