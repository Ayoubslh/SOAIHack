import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator, Modal } from 'react-native';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { getNotifications, clearNotifications, updateNotification, updateAppointment } from '../../lib/api';
import { useTranslation } from '../../lib/i18n';
import { router } from 'expo-router';

export default function InboxTab() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.personalData?.userId);
  const userRole = 'patient'; // Assuming this app is for patients
  const queryClient = useQueryClient();

  const [selectedNotif, setSelectedNotif] = useState<any>(null);
  const [isProcessingLink, setIsProcessingLink] = useState(false);

  const { data: notifications, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['notifications', userId, userRole],
    queryFn: () => getNotifications(userId!, userRole!),
    enabled: !!userId && !!userRole,
  });

  const clearMutation = useMutation({
    mutationFn: () => clearNotifications(userId!, userRole!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', userId, userRole] });
    },
  });

  const handleClearAll = () => {
    clearMutation.mutate();
  };

  const handleProcessLink = async (url: string, statusText: 'confirmed' | 'canceled') => {
    if (!url) return;
    setIsProcessingLink(true);
    try {
      await fetch(url);
      
      // Update appointment status
      if (selectedNotif?.appointment_id) {
        await updateAppointment(selectedNotif.appointment_id, { status: statusText }).catch(err => console.log('Appointment update failed:', err));
      }
      
      // Archive the notification
      const notifId = selectedNotif?._id || selectedNotif?.id;
      if (notifId) {
        await updateNotification(notifId, { status: statusText, archived: true }).catch(err => console.log('Notification update failed:', err));
      }

      // Wait for everything to resolve
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (e) {
      console.log('Error processing confirmation link:', e);
    } finally {
      setIsProcessingLink(false);
      setSelectedNotif(null);
      router.push('/');
    }
  };

  const filteredNotifications = notifications?.filter(
    (n: any) => n.user_id === userId || n.patient_id === userId
  ) || [];

  const renderItem = ({ item }: { item: any }) => (
    <View className="mb-3 rounded-[16px] border border-border bg-card p-4 shadow-sm">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-2">
          <View className="mb-1 flex-row items-center">
            <Ionicons 
              name={item.type === 'PREDICTIVE_NUDGE' || item.type === 'NUDGE' ? "calendar-outline" : "notifications-outline"} 
              size={16} 
              color="#0ea5e9" 
            />
            <Text className="ml-2 text-sm font-bold text-dark">
              {item.title || 'Notification'}
            </Text>
          </View>
          <Text className="text-sm text-muted">{item.message || item.body || ''}</Text>
          
          {item.appointment_id && (
            <TouchableOpacity 
              onPress={() => {
                if (item.confirm_url && item.decline_url) {
                  setSelectedNotif(item);
                } else {
                  router.push({ pathname: '/rebook', params: { appointmentId: item.appointment_id }})
                }
              }}
              className={`mt-3 self-start rounded-full px-3 py-1.5 ${item.confirm_url ? 'bg-amber-50' : 'bg-sky-50'}`}
            >
              <Text className={`text-xs font-bold ${item.confirm_url ? 'text-amber-600' : 'text-[#0ea5e9]'}`}>
                {item.confirm_url ? 'Confirm Attendance' : 'View Appointment'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text className="text-[10px] text-muted">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : ''}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-xl font-extrabold text-dark">Inbox</Text>
        {filteredNotifications.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} disabled={clearMutation.isPending}>
            <Text className="text-sm font-bold text-[#0ea5e9]">
              {clearMutation.isPending ? 'Clearing...' : 'Clear All'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0ea5e9" />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item, index) => item.id || item._id || index.toString()}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#0ea5e9" />
          }
          ListEmptyComponent={
            <View className="mt-10 items-center justify-center px-6">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <Ionicons name="notifications-off-outline" size={32} color="#94a3b8" />
              </View>
              <Text className="text-center text-lg font-bold text-dark">No Notifications</Text>
              <Text className="mt-1 text-center text-sm text-muted">
                You&apos;re all caught up! New notifications will appear here.
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {selectedNotif && (
        <Modal transparent={true} visible={!!selectedNotif} animationType="fade">
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="w-full rounded-3xl bg-white p-6 shadow-xl">
              <Text className="mb-2 text-center text-xl font-bold text-dark">
                Action Required
              </Text>
              <Text className="mb-6 text-center text-sm text-muted">
                {selectedNotif.message || 'Please confirm your appointment status.'}
              </Text>
              
              <View className="space-y-3 gap-y-3">
                <TouchableOpacity
                  disabled={isProcessingLink}
                  onPress={() => handleProcessLink(selectedNotif.confirm_url, 'confirmed')}
                  className="w-full items-center justify-center rounded-xl bg-[#0ea5e9] py-3.5"
                >
                  <Text className="text-sm font-bold text-white">
                    {isProcessingLink ? 'Processing...' : 'Accept Appointment'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isProcessingLink}
                  onPress={() => handleProcessLink(selectedNotif.decline_url, 'canceled')}
                  className="w-full items-center justify-center rounded-xl bg-red-500 py-3.5"
                >
                  <Text className="text-sm font-bold text-white">
                    {isProcessingLink ? 'Processing...' : 'Cancel Appointment'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  disabled={isProcessingLink}
                  onPress={() => setSelectedNotif(null)}
                  className="mt-2 w-full items-center justify-center py-2"
                >
                  <Text className="text-sm font-bold text-muted">Go Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
