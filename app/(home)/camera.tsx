import config from '@/config';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

const { width, height } = Dimensions.get('window');

// Grid constants - 2 cột
const GRID_PADDING = 16;
const GRID_CONTENT_PADDING = 8;
const GRID_GAP = 8;
// Tính width của grid container (bên trong padding)
const GRID_CONTAINER_WIDTH = width - GRID_PADDING * 2 - GRID_CONTENT_PADDING * 2;
// Mỗi cell = (container - gap) / 2
const CELL_WIDTH = (GRID_CONTAINER_WIDTH - GRID_GAP) / 2;
const CELL_HEIGHT = CELL_WIDTH * 0.65;

// Camera list constants - 1 cột
const LIST_GAP = 8;

// Danh sách camera mẫu
const CAMERA_LIST = [
  { id: '8', channel: '1', name: 'Camera Sảnh', color: '#e94560' },
  { id: '2', channel: '6', name: 'Camera Phòng họp', color: '#45e960' },
  { id: '3', channel: '10', name: 'Camera Bãi xe', color: '#4560e9' },
];

interface Camera {
  id: string;
  name: string;
  channel: string;
  color: string;
}

// Draggable Camera Item Component
interface DraggableCameraItemProps {
  camera: Camera;
  dropZoneLayout: React.MutableRefObject<{ x: number; y: number; width: number; height: number }>;
  onDragStart: () => void;
  onDragEnd: () => void;
  onHoverDropZone: (isHovering: boolean) => void;
  onDropOnZone: (camera: Camera) => void;
}

function DraggableCameraItem({
  camera,
  dropZoneLayout,
  onDragStart,
  onDragEnd,
  onHoverDropZone,
  onDropOnZone,
}: DraggableCameraItemProps) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(1);
  const opacity = useSharedValue(1);
  const isDraggingActive = useSharedValue(false);

  const isInDropZone = useCallback((absoluteX: number, absoluteY: number): boolean => {
    const zone = dropZoneLayout.current;
    return (
      absoluteX >= zone.x &&
      absoluteX <= zone.x + zone.width &&
      absoluteY >= zone.y &&
      absoluteY <= zone.y + zone.height
    );
  }, [dropZoneLayout]);

  const handleUpdate = useCallback((absoluteX: number, absoluteY: number) => {
    const inZone = isInDropZone(absoluteX, absoluteY);
    onHoverDropZone(inZone);
  }, [isInDropZone, onHoverDropZone]);

  const handleEnd = useCallback((absoluteX: number, absoluteY: number) => {
    const inZone = isInDropZone(absoluteX, absoluteY);
    if (inZone) {
      onDropOnZone(camera);
    }
    onHoverDropZone(false);
    onDragEnd();
  }, [isInDropZone, onDropOnZone, onHoverDropZone, onDragEnd, camera]);

  // Gesture chỉ cho drag handle
  const dragGesture = Gesture.Pan()
    .onStart(() => {
      isDraggingActive.value = true;
      scale.value = withSpring(1.05);
      zIndex.value = 1000;
      opacity.value = 0.9;
      runOnJS(onDragStart)();
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      runOnJS(handleUpdate)(event.absoluteX, event.absoluteY);
    })
    .onEnd((event) => {
      runOnJS(handleEnd)(event.absoluteX, event.absoluteY);
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 1;
      opacity.value = withTiming(1);
      isDraggingActive.value = false;
    })
    .onFinalize(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      scale.value = withSpring(1);
      zIndex.value = 1;
      opacity.value = withTiming(1);
      isDraggingActive.value = false;
      runOnJS(onHoverDropZone)(false);
      runOnJS(onDragEnd)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.cameraItem, animatedStyle]}>
      <View style={[styles.cameraItemColor, { backgroundColor: camera.color }]} />
      <Text style={styles.cameraItemName} numberOfLines={1}>
        {camera.name}
      </Text>
      <GestureDetector gesture={dragGesture}>
        <View style={styles.dragHandle}>
          <Text style={styles.dragHandleText}>⋮⋮</Text>
        </View>
      </GestureDetector>
    </Animated.View>
  );
}

export default function CameraScreen() {
  const [gridCameras, setGridCameras] = useState<Camera[]>([]);
  const [fullscreenCamera, setFullscreenCamera] = useState<Camera | null>(null);
  const [isHoveringDropZone, setIsHoveringDropZone] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dropZoneLayout = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const dropZoneRef = useRef<View>(null);

  const handleDropZoneLayout = useCallback(() => {
    dropZoneRef.current?.measureInWindow((x, y, w, h) => {
      dropZoneLayout.current = { x, y, width: w, height: h };
    });
  }, []);

  const handleAddCamera = useCallback((camera: Camera) => {
    setGridCameras((prev) => {
      if (prev.find((c) => c.id === camera.id)) return prev;
      return [...prev, camera];
    });
  }, []);

  const handleRemoveCamera = useCallback((cameraId: string) => {
    setGridCameras((prev) => prev.filter((c) => c.id !== cameraId));
  }, []);

  const assignedCameraIds = gridCameras.map((c) => c.id);
  const availableCameras = CAMERA_LIST.filter((cam) => !assignedCameraIds.includes(cam.id));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Grid Section */}
      <View style={styles.gridSection}>
        <View style={styles.gridHeader}>
          <Text style={styles.sectionTitle}>📹 Hiển thị camera</Text>
          <View style={styles.gridStats}>
            <Text style={styles.gridStatsText}>
              {gridCameras.length} camera
            </Text>
          </View>
        </View>

        <View
          ref={dropZoneRef}
          style={[
            styles.dropZone,
            isHoveringDropZone && styles.dropZoneActive,
          ]}
          onLayout={handleDropZoneLayout}
        >
          {gridCameras.length === 0 ? (
            <View style={styles.emptyDropZone}>
              <Text style={styles.emptyDropZoneIcon}>
                {isHoveringDropZone ? '📹' : '📺'}
              </Text>
              <Text style={[
                styles.emptyDropZoneText,
                isHoveringDropZone && styles.emptyDropZoneTextActive
              ]}>
                {isHoveringDropZone ? 'Thả để thêm camera!' : 'Kéo camera vào đây'}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.gridScrollView}
              contentContainerStyle={styles.gridContent}
              showsVerticalScrollIndicator={false}
              scrollEnabled={!isDragging}
            >
              <View style={styles.gridContainer}>
                {gridCameras.map((camera) => (
                  <TouchableOpacity
                    key={camera.id}
                    style={[styles.gridCell, { borderColor: camera.color }]}
                    onPress={() => setFullscreenCamera(camera)}
                    onLongPress={() => handleRemoveCamera(camera.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cameraWebViewContainer}>
                      {/* Loading overlay - hiển thị ở giữa */}
                      <View style={styles.loadingOverlay}>
                        <Text style={styles.loadingText}>⏳</Text>
                      </View>

                      {/* WebView */}
                      <WebView
                        source={{
                          uri: config.getAuthUrl(config.GO2RTC_URL + `/stream.html?src=device-${camera.id}-channel-${camera.channel}`),
                          headers: config.getAuthHeaders(),
                        }}
                        style={styles.cameraWebView}
                        scrollEnabled={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        scalesPageToFit={true}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        setBuiltInZoomControls={false}
                        onHttpError={(syntheticEvent) => {
                          const { nativeEvent } = syntheticEvent;
                          console.log('HTTP Error:', nativeEvent.statusCode);
                        }}
                        injectedJavaScript={`
                          const scale = 0.25;
                          document.body.style.margin = '0';
                          document.body.style.padding = '0';
                          document.body.style.overflow = 'hidden';
                          document.body.style.textAlign = 'center';
                          document.body.style.transform = 'scale(' + scale + ')';
                          document.body.style.transformOrigin = 'top left';
                          document.body.style.width = (100 / scale) + '%';
                          document.body.style.height = (100 / scale) + '%';
                          true;
                        `}
                      />

                      {/* Camera label */}
                      <View style={[styles.cameraLabel, { backgroundColor: camera.color }]}>
                        <Text style={styles.cameraLabelText} numberOfLines={1}>
                          {camera.name}
                        </Text>
                      </View>

                      {/* Remove button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveCamera(camera.id)}
                      >
                        <Text style={styles.removeButtonText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Drop zone hint when grid has items */}
              {isHoveringDropZone && (
                <View style={styles.dropHintContainer}>
                  <Text style={styles.dropHintText}>📹 Thả để thêm camera!</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {gridCameras.length > 0 && (
          <Text style={styles.gridHint}>
            Nhấn camera để xem toàn màn hình • Nhấn giữ hoặc ✕ để xóa
          </Text>
        )}
      </View>

      {/* Camera List Section */}
      <View style={styles.cameraListSection}>
        <View style={styles.cameraListHeader}>
          <Text style={styles.sectionTitle}>📋 Danh sách Camera</Text>
          <Text style={styles.cameraListCount}>
            {availableCameras.length} còn lại
          </Text>
        </View>
        <Text style={styles.cameraListHint}>
          Giữ vào ⋮⋮ và kéo camera lên vùng hiển thị để thêm
        </Text>

        <ScrollView
          style={styles.cameraListScrollView}
          contentContainerStyle={styles.cameraListContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!isDragging}
        >
          <View style={styles.cameraListGrid}>
            {availableCameras.map((camera) => (
              <DraggableCameraItem
                key={camera.id}
                camera={camera}
                dropZoneLayout={dropZoneLayout}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                onHoverDropZone={setIsHoveringDropZone}
                onDropOnZone={handleAddCamera}
              />
            ))}
          </View>
          {availableCameras.length === 0 && (
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>✅ Tất cả camera đã được thêm vào hiển thị</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Fullscreen Camera Modal */}
      <Modal
        visible={!!fullscreenCamera}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setFullscreenCamera(null)}
      >
        <View style={styles.fullscreenContainer}>
          <LinearGradient
            colors={['#1a1a2e', '#0f3460']}
            style={styles.fullscreenHeader}
          >
            <Text style={styles.fullscreenTitle}>
              📹 {fullscreenCamera?.name}
            </Text>
            <TouchableOpacity
              style={styles.fullscreenCloseButton}
              onPress={() => setFullscreenCamera(null)}
            >
              <Text style={styles.fullscreenCloseText}>✕</Text>
            </TouchableOpacity>
          </LinearGradient>

          {fullscreenCamera && (
            <WebView
              source={{
                uri: config.getAuthUrl(config.GO2RTC_URL + `/stream.html?src=device-${fullscreenCamera.id}-channel-${fullscreenCamera.channel}`),
                headers: config.getAuthHeaders(),
              }}
              style={styles.fullscreenWebView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.log('Fullscreen HTTP Error:', nativeEvent.statusCode);
              }}
              renderLoading={() => (
                <View style={styles.fullscreenLoading}>
                  <Text style={styles.fullscreenLoadingText}>
                    ⏳ Đang tải camera...
                  </Text>
                </View>
              )}
            />
          )}
        </View>
      </Modal>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  // Grid Section
  gridSection: {
    paddingHorizontal: GRID_PADDING,
    paddingTop: 16,
    flex: 1,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridStats: {
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  gridStatsText: {
    fontSize: 12,
    color: '#e94560',
    fontWeight: '600',
  },
  dropZone: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  dropZoneActive: {
    borderColor: '#e94560',
    borderWidth: 3,
    backgroundColor: 'rgba(233, 69, 96, 0.15)',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  emptyDropZone: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyDropZoneIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyDropZoneText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  emptyDropZoneTextActive: {
    color: '#e94560',
    fontWeight: '700',
    fontSize: 18,
  },
  gridScrollView: {
    flex: 1,
  },
  gridContent: {
    padding: 8,
  },
  gridContainer: {
    width: GRID_CONTAINER_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  gridCell: {
    width: CELL_WIDTH,
    height: CELL_HEIGHT,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  gridHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  dropHintContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
  },
  dropHintText: {
    fontSize: 16,
    color: '#e94560',
    fontWeight: '700',
  },
  cameraWebViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  cameraWebView: {
    width: "100%",
    height: "100%",
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  cameraLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cameraLabelText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    zIndex: 0,
  },
  loadingText: {
    fontSize: 24,
  },
  // Camera List Section
  cameraListSection: {
    height: height * 0.35,
    borderTopWidth: 1,
    marginTop: 10,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  cameraListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  cameraListCount: {
    fontSize: 13,
    color: '#9ca3af',
  },
  cameraListHint: {
    fontSize: 12,
    color: '#6b7280',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  cameraListScrollView: {
    flex: 1,
  },
  cameraListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  cameraListGrid: {
    gap: LIST_GAP,
  },
  cameraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cameraItemColor: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginRight: 12,
  },
  cameraItemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  dragHandle: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(233, 69, 96, 0.2)',
    borderRadius: 10,
    marginLeft: 8,
  },
  dragHandleText: {
    fontSize: 16,
    color: '#e94560',
    fontWeight: '700',
  },
  emptyList: {
    padding: 30,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Fullscreen Modal
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  fullscreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  fullscreenTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  fullscreenCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenCloseText: {
    fontSize: 20,
    color: '#fff',
  },
  fullscreenWebView: {
    flex: 1,
  },
  fullscreenLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f3460',
  },
  fullscreenLoadingText: {
    fontSize: 16,
    color: '#fff',
  },
});
