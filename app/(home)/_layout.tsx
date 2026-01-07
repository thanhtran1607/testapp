import { useAuth } from '@/contexts/AuthContext';
import { DrawerActions } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { height } = Dimensions.get('window');

// Custom hamburger button component
function HamburgerButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.hamburgerButton}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      activeOpacity={0.7}
    >
      <View style={styles.hamburgerLine} />
      <View style={[styles.hamburgerLine, styles.hamburgerLineMiddle]} />
      <View style={styles.hamburgerLine} />
    </TouchableOpacity>
  );
}

interface MenuItemProps {
  icon: string;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

function MenuItem({ icon, label, onPress, isActive }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuIconContainer, isActive && styles.menuIconContainerActive]}>
        <Text style={styles.menuIcon}>{icon}</Text>
      </View>
      <Text style={[styles.menuText, isActive && styles.menuTextActive]}>{label}</Text>
      <View style={styles.menuArrow}>
        <Text style={styles.menuArrowText}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

function CustomDrawerContent(props: any) {
  const { logout, user } = useAuth();
  const router = useRouter();
  const currentRoute = props.state?.routes[props.state?.index]?.name;

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#e94560', '#ff6b6b']}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarText}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </LinearGradient>
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.userName}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
          <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
          <View style={styles.userBadge}>
            <Text style={styles.userBadgeText}>✨ Premium</Text>
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>MENU CHÍNH</Text>
          
          <MenuItem
            icon="🏠"
            label="Trang chủ"
            onPress={() => props.navigation.navigate('index')}
            isActive={currentRoute === 'index'}
          />
          <MenuItem
            icon="👤"
            label="Hồ sơ cá nhân"
            onPress={() => props.navigation.navigate('profile')}
            isActive={currentRoute === 'profile'}
          />
          <MenuItem
            icon="⚙️"
            label="Cài đặt"
            onPress={() => props.navigation.navigate('settings')}
            isActive={currentRoute === 'settings'}
          />
        </View>

        {/* Other Section */}
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>KHÁC</Text>
          
          <MenuItem
            icon="🔔"
            label="Thông báo"
            onPress={() => {}}
          />
          <MenuItem
            icon="❓"
            label="Trợ giúp"
            onPress={() => {}}
          />
          <MenuItem
            icon="📝"
            label="Phản hồi"
            onPress={() => {}}
          />
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <LinearGradient
            colors={['rgba(233, 69, 96, 0.2)', 'rgba(255, 107, 107, 0.1)']}
            style={styles.statsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Dự án</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Nhiệm vụ</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Nhóm</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#dc2626', '#ef4444']}
            style={styles.logoutGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.logoutIcon}>🚪</Text>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => <HamburgerButton />,
        drawerStyle: {
          backgroundColor: '#1a1a2e',
          width: 300,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.7)',
        headerShadowVisible: false,
        swipeEnabled: true,
        swipeEdgeWidth: 100,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Trang chủ',
          title: 'Trang chủ',
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Hồ sơ',
          title: 'Hồ sơ cá nhân',
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: 'Cài đặt',
          title: 'Cài đặt',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  hamburgerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  hamburgerLine: {
    width: 22,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
    marginVertical: 2.5,
  },
  hamburgerLineMiddle: {
    width: 16,
    alignSelf: 'flex-start',
    marginLeft: 11,
  },
  drawerContainer: {
    flex: 1,
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
    paddingTop: 60,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#1a1a2e',
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  userEmail: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 12,
  },
  userBadge: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.3)',
  },
  userBadgeText: {
    color: '#e94560',
    fontSize: 12,
    fontWeight: '600',
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  menuSectionTitle: {
    color: '#6b7280',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 12,
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  menuItemActive: {
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconContainerActive: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
  },
  menuIcon: {
    fontSize: 18,
  },
  menuText: {
    flex: 1,
    color: '#d1d5db',
    fontSize: 15,
    fontWeight: '500',
  },
  menuTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  menuArrow: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuArrowText: {
    color: '#6b7280',
    fontSize: 18,
    fontWeight: '300',
  },
  statsCard: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statsGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(233, 69, 96, 0.2)',
    borderRadius: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#9ca3af',
    fontSize: 11,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomSection: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  logoutIcon: {
    fontSize: 16,
  },
  logoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    color: '#4b5563',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
  },
});
