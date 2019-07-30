--
-- @Author: saber2pr
-- @Date: 2019-07-30 14:00:58
-- @Last Modified by:   saber2pr
-- @Last Modified time: 2019-07-30 14:00:58
--

module Main where

import Control.Applicative (liftA)

async_init :: Monad m => m Integer
async_init = pure 1

async_join_add :: Monad m => m Integer -> m Integer
async_join_add m = m >>= \a -> pure $ a + 1

async_join_add2 :: Monad m => m Integer -> m Integer
async_join_add2 m = do
  a <- m
  return $ a + 1

async_lift_add :: Monad m => m Integer -> m Integer
async_lift_add m = liftA (\a -> a + 1) m

async_fmap_add :: Monad m => m Integer -> m Integer
async_fmap_add m = fmap (\a -> a + 1) m

main :: IO ()
main = do
  -- a <- async_fmap_add $ async_lift_add $ async_join_add async_init
  a <- async_fmap_add . async_lift_add . async_join_add $ async_init
  print a
