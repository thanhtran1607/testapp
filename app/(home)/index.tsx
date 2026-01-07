import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Xin chào! 👋</Text>
          <Text style={styles.welcomeText}>Chào mừng bạn trở lại</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <LinearGradient
                colors={['rgba(233, 69, 96, 0.2)', 'rgba(233, 69, 96, 0.05)']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📊</Text>
                <Text style={styles.actionLabel}>Thống kê</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📝</Text>
                <Text style={styles.actionLabel}>Ghi chú</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <LinearGradient
                colors={['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 0.05)']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>📅</Text>
                <Text style={styles.actionLabel}>Lịch</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.7}>
              <LinearGradient
                colors={['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 0.05)']}
                style={styles.actionGradient}
              >
                <Text style={styles.actionIcon}>⭐</Text>
                <Text style={styles.actionLabel}>Yêu thích</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text>✅</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Hoàn thành nhiệm vụ</Text>
              <Text style={styles.activityTime}>2 phút trước</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text>📌</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Tạo dự án mới</Text>
              <Text style={styles.activityTime}>1 giờ trước</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text>💬</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Nhận tin nhắn mới</Text>
              <Text style={styles.activityTime}>3 giờ trước</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 28,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 15,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d1d5db',
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 28,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#d1d5db',
  },
  recentSection: {
    marginBottom: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6b7280',
  },
});
