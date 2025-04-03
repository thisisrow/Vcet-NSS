import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Image,
  Alert
} from 'react-native';
import { AuthContext } from '../context/authContext';
import { useSocket } from '../context/socketContext';
import FooterMenu from '../components/Menus/FooterMenu';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import axios from 'axios';
import { API_URL, COLORS } from '../config/constants';

const { width, height } = Dimensions.get('window');

const ChatVideo = ({ navigation }) => {
  const [auth] = useContext(AuthContext);
  const { 
    messages, 
    activeRoom,
    loading: chatLoading,
    error: chatError,
    joinRoom, 
    sendMessage, 
    markMessagesAsRead,
    handleTyping
  } = useSocket();
  
  const [messageText, setMessageText] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUsersList, setShowUsersList] = useState(true);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [sending, setSending] = useState(false);
  
  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/auth/users`, {
          headers: {
            Authorization: `Bearer ${auth?.token}`
          }
        });
        
        // Filter out current user
        const filteredUsers = data?.users?.filter(
          user => user._id !== auth?.user?._id
        );
        
        setUsers(filteredUsers);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching users:', error);
        setError('Failed to load users');
        setLoading(false);
      }
    };
    
    if (auth?.token) {
      fetchUsers();
    }
  }, [auth?.token]);

  // Show error alerts
  useEffect(() => {
    if (chatError) {
      Alert.alert('Error', chatError);
    }
  }, [chatError]);
  
  // Handle selecting a user to chat with
  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setShowUsersList(false);
    
    // Join a room - use a combination of user IDs for uniqueness
    const roomId = [auth?.user?._id, user._id].sort().join('-');
    joinRoom(roomId);
  };
  
  // Update the useEffect hook for marking messages as read
  useEffect(() => {
    let timeoutId;
    
    if (!showUsersList && activeRoom && messages.length > 0 && auth?.user?._id) {
      // Delay marking messages as read by 2 seconds to avoid race conditions
      timeoutId = setTimeout(() => {
        markMessagesAsRead()
          .then(success => {
            if (!success) {
              console.log('Mark as read was not successful, but not critical');
            }
          })
          .catch(err => {
            console.error('Failed to mark messages as read:', err);
            // Non-critical error, don't show to user
          });
      }, 2000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showUsersList, activeRoom, messages.length, auth?.user?._id]);
  
  // Update the handleSendMessage function to not try to mark messages as read
  const handleSendMessage = async () => {
    if (messageText.trim() === '' || sending) return;
    
    setSending(true);
    const sent = await sendMessage(messageText);
    if (sent) {
      setMessageText('');
      // No need to mark messages as read after sending since they're already yours
    } else if (!chatError) {
      Alert.alert('Error', 'Failed to send message');
    }
    setSending(false);
  };

  // Handle typing status
  const handleMessageChange = (text) => {
    setMessageText(text);
    handleTyping(text.length > 0);
  };
  
  // Initiate a video call
  const handleVideoCall = () => {
    if (!selectedUser || !activeRoom) return;
    
    Alert.alert(
      'Feature Coming Soon',
      'Video call functionality will be available in a future update.',
      [{ text: 'OK' }]
    );
  };
  
  // Render a message item
  const renderMessage = ({ item }) => {
    // Safely handle the case where sender might not have proper structure
    const senderId = item.sender?._id || item.sender;
    const isMyMessage = senderId === auth?.user?._id;
    const senderName = item.sender?.name || 'Unknown';
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessage : styles.theirMessage
      ]}>
        {!isMyMessage && (
          <Text style={styles.messageSender}>{senderName}</Text>
        )}
        <Text style={[
          styles.messageContent,
          isMyMessage ? styles.myMessageContent : styles.theirMessageContent
        ]}>
          {item.message}
        </Text>
        <Text style={[
          styles.messageTime,
          isMyMessage ? styles.myMessageTime : styles.theirMessageTime
        ]}>
          {moment(item.createdAt).format('HH:mm')}
        </Text>
      </View>
    );
  };
  
  // Render a user item
  const renderUser = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.userItem}
        onPress={() => handleSelectUser(item)}
      >
        <View style={styles.userAvatar}>
          <Text style={styles.userInitial}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Main render
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {!showUsersList && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              setShowUsersList(true);
              setSelectedUser(null);
            }}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>
          {showUsersList ? 'Chats' : selectedUser?.name}
        </Text>
        {!showUsersList && (
          <TouchableOpacity 
            style={styles.videoButton}
            onPress={handleVideoCall}
          >
            <Icon name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Render users list or chat */}
      {showUsersList ? (
        <View style={styles.usersList}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={50} color={COLORS.DANGER} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  if (auth?.token) {
                    setLoading(true);
                    setError(null);
                    // Refetch users list
                    fetchUsers();
                  }
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={users}
              renderItem={renderUser}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.usersListContent}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>No users found</Text>
                </View>
              }
            />
          )}
        </View>
      ) : videoCallActive ? (
        renderVideoCall()
      ) : (
        <KeyboardAvoidingView
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {chatLoading && messages.length === 0 ? (
            <View style={styles.chatLoadingContainer}>
              <ActivityIndicator size="large" color={COLORS.PRIMARY} />
              <Text style={styles.chatLoadingText}>Loading messages...</Text>
            </View>
          ) : messages.length > 0 ? (
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item, index) => item._id || index.toString()}
              contentContainerStyle={styles.messagesContainer}
              inverted={false}
            />
          ) : (
            <View style={styles.emptyChat}>
              <Icon name="chatbubble-ellipses-outline" size={60} color={COLORS.LIGHT_GRAY} />
              <Text style={styles.emptyChatText}>No messages yet</Text>
              <Text style={styles.emptyChatSubText}>Start the conversation!</Text>
            </View>
          )}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={messageText}
              onChangeText={handleMessageChange}
              placeholder="Type a message..."
              placeholderTextColor={COLORS.DARK_GRAY}
              editable={!sending}
            />
            <TouchableOpacity 
              style={[styles.sendButton, sending && styles.sendingButton]}
              onPress={handleSendMessage}
              disabled={sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Icon name="send" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}
      
      {/* Footer Menu only shown on user list */}
      {showUsersList && (
        <View style={styles.footer}>
          <FooterMenu />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: COLORS.WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  backButton: {
    padding: 5,
  },
  videoButton: {
    padding: 5,
  },
  usersList: {
    flex: 1,
  },
  usersListContent: {
    padding: 10,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GRAY,
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    marginBottom: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  userInitial: {
    color: COLORS.WHITE,
    fontSize: 22,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT,
    marginBottom: 5,
  },
  userRole: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
  },
  loader: {
    marginTop: 50,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 70,
  },
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 12,
    borderRadius: 15,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: 5,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.WHITE,
    borderBottomLeftRadius: 5,
  },
  messageSender: {
    fontSize: 13,
    color: COLORS.DARK_GRAY,
    marginBottom: 3,
  },
  messageContent: {
    fontSize: 16,
  },
  myMessageContent: {
    color: COLORS.WHITE,
  },
  theirMessageContent: {
    color: COLORS.TEXT,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  myMessageTime: {
    color: '#e0e0e0',
  },
  theirMessageTime: {
    color: COLORS.DARK_GRAY,
  },
  emptyChat: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.DARK_GRAY,
    marginTop: 10,
  },
  emptyChatSubText: {
    fontSize: 14,
    color: COLORS.DARK_GRAY,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.WHITE,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GRAY,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingButton: {
    backgroundColor: COLORS.DARK_GRAY,
  },
  footer: {
    backgroundColor: COLORS.WHITE,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: COLORS.DANGER,
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyListText: {
    color: COLORS.DARK_GRAY,
    fontSize: 16,
  },
  chatLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatLoadingText: {
    marginTop: 10,
    color: COLORS.DARK_GRAY,
  },
});

export default ChatVideo; 