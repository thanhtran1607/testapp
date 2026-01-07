import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* <View style={styles.decorCircle1} /> */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chung</Text>
          
          <View style={styles.settingsCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌙</Text>
                <View>
                  <Text style={styles.settingLabel}>Chế độ tối</Text>
                  <Text style={styles.settingDesc}>Bật giao diện tối</Text>
                </View>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#374151', true: '#e94560' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🔔</Text>
                <View>
                  <Text style={styles.settingLabel}>Thông báo</Text>
                  <Text style={styles.settingDesc}>Nhận thông báo đẩy</Text>
                </View>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#374151', true: '#e94560' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.settingDivider} />

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>👆</Text>
                <View>
                  <Text style={styles.settingLabel}>Đăng nhập sinh trắc</Text>
                  <Text style={styles.settingDesc}>Vân tay / Face ID</Text>
                </View>
              </View>
              <Switch
                value={biometric}
                onValueChange={setBiometric}
                trackColor={{ false: '#374151', true: '#e94560' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ứng dụng</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItemClickable} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🌐</Text>
                <View>
                  <Text style={styles.settingLabel}>Ngôn ngữ</Text>
                  <Text style={styles.settingDesc}>Tiếng Việt</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItemClickable} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>💾</Text>
                <View>
                  <Text style={styles.settingLabel}>Bộ nhớ cache</Text>
                  <Text style={styles.settingDesc}>12.5 MB</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItemClickable} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📱</Text>
                <View>
                  <Text style={styles.settingLabel}>Phiên bản</Text>
                  <Text style={styles.settingDesc}>1.0.0</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItemClickable} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>❓</Text>
                <View>
                  <Text style={styles.settingLabel}>Trung tâm trợ giúp</Text>
                  <Text style={styles.settingDesc}>Câu hỏi thường gặp</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItemClickable} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📧</Text>
                <View>
                  <Text style={styles.settingLabel}>Liên hệ</Text>
                  <Text style={styles.settingDesc}>support@app.com</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <TouchableOpacity style={styles.settingItemClickable} activeOpacity={0.7}>
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📄</Text>
                <View>
                  <Text style={styles.settingLabel}>Điều khoản sử dụng</Text>
                  <Text style={styles.settingDesc}>Chính sách & điều khoản</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.dangerCard}>
            <TouchableOpacity style={styles.dangerButton} activeOpacity={0.7}>
              <Text style={styles.dangerIcon}>🗑️</Text>
              <Text style={styles.dangerText}>Xóa tất cả dữ liệu</Text>
            </TouchableOpacity>
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
  decorCircle1: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    top: -80,
    left: -100,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingItemClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#6b7280',
  },
  settingArrow: {
    fontSize: 22,
    color: '#6b7280',
  },
  settingDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginLeft: 52,
  },
  dangerCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    overflow: 'hidden',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  dangerIcon: {
    fontSize: 18,
  },
  dangerText: {
    fontSize: 15,
    color: '#ef4444',
    fontWeight: '600',
  },
});
