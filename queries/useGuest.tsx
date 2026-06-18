
import guestApiRequest from '@/apiRequest/guest'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}

export const useGuestRecoverMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.recover
  })
}

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}

export const useGuestOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guestApiRequest.order,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-orders'] })
    }
  })
}

export const useGuestGetOrderListQuery = () => {
  return useQuery({
    queryFn: guestApiRequest.getOrderList,
    queryKey: ['guest-orders']
  })
}

export const useGuestCancelOrderMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guestApiRequest.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-orders'] })
    }
  })
}

export const useGuestCancelOrderDetailMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: guestApiRequest.cancelOrderDetail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-orders'] })
    }
  })
}
