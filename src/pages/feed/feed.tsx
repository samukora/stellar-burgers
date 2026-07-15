import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  selectOrders,
  selectIsFeedsLoading,
  getFeeds
} from '../../services/slices/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  const orders = useSelector(selectOrders);
  const isFeedsLoading = useSelector(selectIsFeedsLoading);

  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };

  if (isFeedsLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
