// src/app/admin/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Mail, Check, RefreshCw, Copy, LogOut, Lock, User, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface GroupedMessages {
  name: string;
  email: string;
  messages: ContactMessage[];
  unreadCount: number;
  latestMessage: string;
  latestDate: string;
}

export default function MessagesPage() {
  const ADMIN_PASSWORD = "raiyeean123";
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Check if already logged in - ONLY on client side
  useEffect(() => {
    setMounted(true);
    const savedAuth = localStorage.getItem('admin_auth');
    if (savedAuth === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchMessages();
    } else {
      setLoading(false);
    }
  }, []);

  // API helper function with authentication
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('admin_auth') || ADMIN_PASSWORD;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(endpoint, defaultOptions);
      
      if (response.status === 401) {
        handleLogout();
        throw new Error('Authentication expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  };

  // Fetch messages from API
  const fetchMessages = async (showToast = false) => {
    try {
      setRefreshing(true);
      const data = await apiRequest('/api/contact');
      
      if (data.success && Array.isArray(data.messages)) {
        setMessages(data.messages);
        if (showToast) {
          toast.success('Messages refreshed successfully');
        }
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error(error.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Group messages by user (name + email)
  const groupMessagesByUser = (msgs: ContactMessage[]): GroupedMessages[] => {
    const groups: Record<string, GroupedMessages> = {};
    
    msgs.forEach(msg => {
      const key = `${msg.name.toLowerCase()}_${msg.email.toLowerCase()}`;
      
      if (!groups[key]) {
        groups[key] = {
          name: msg.name,
          email: msg.email,
          messages: [],
          unreadCount: 0,
          latestMessage: '',
          latestDate: ''
        };
      }
      
      groups[key].messages.push(msg);
      if (!msg.read) {
        groups[key].unreadCount++;
      }
    });
    
    // Sort messages within each group and set latest message
    Object.values(groups).forEach(group => {
      group.messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (group.messages.length > 0) {
        group.latestMessage = group.messages[0].message.substring(0, 100) + (group.messages[0].message.length > 100 ? '...' : '');
        group.latestDate = group.messages[0].createdAt;
      }
    });
    
    // Sort groups by latest message date
    return Object.values(groups).sort((a, b) => 
      new Date(b.latestDate).getTime() - new Date(a.latestDate).getTime()
    );
  };

  // Auto-refresh messages
  useEffect(() => {
    if (isAuthenticated && autoRefreshEnabled && mounted) {
      const interval = setInterval(() => {
        fetchMessages(false);
      }, 30000); // 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, autoRefreshEnabled, mounted]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', password);
      setAuthError('');
      fetchMessages();
      toast.success('Login successful!');
    } else {
      setAuthError('Invalid password. Please try again.');
      toast.error('Invalid password');
    }
  };

  // Mark all messages as read
  const handleMarkAllAsRead = async () => {
    if (messages.length === 0) return;
    
    const unreadMessages = messages.filter(msg => !msg.read);
    
    try {
      const promises = unreadMessages.map(msg => 
        apiRequest('/api/contact', {
          method: 'PATCH',
          body: JSON.stringify({ id: msg.id, read: true })
        })
      );
      
      await Promise.all(promises);
      await fetchMessages(false);
      toast.success(`Marked ${unreadMessages.length} messages as read`);
    } catch (error) {
      toast.error('Failed to mark messages as read');
    }
  };

  // Mark all messages from a user as read
  const handleMarkUserAsRead = async (userKey: string) => {
    const userMessages = messages.filter(msg => {
      const key = `${msg.name.toLowerCase()}_${msg.email.toLowerCase()}`;
      return key === userKey && !msg.read;
    });
    
    if (userMessages.length === 0) return;
    
    try {
      const promises = userMessages.map(msg => 
        apiRequest('/api/contact', {
          method: 'PATCH',
          body: JSON.stringify({ id: msg.id, read: true })
        })
      );
      
      await Promise.all(promises);
      await fetchMessages(false);
      toast.success(`Marked ${userMessages.length} messages as read`);
    } catch (error) {
      toast.error('Failed to mark messages as read');
    }
  };

  // Mark single message as read
  const handleMarkSingleAsRead = async (messageId: string) => {
    try {
      await apiRequest('/api/contact', {
        method: 'PATCH',
        body: JSON.stringify({ id: messageId, read: true })
      });
      
      await fetchMessages(false);
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark message as read');
    }
  };

  // Delete all messages from a user
  const handleDeleteUser = async (userKey: string) => {
    const userMessages = messages.filter(msg => {
      const key = `${msg.name.toLowerCase()}_${msg.email.toLowerCase()}`;
      return key === userKey;
    });
    
    if (!confirm(`Delete all ${userMessages.length} messages from ${userMessages[0]?.name}?`)) {
      return;
    }
    
    try {
      const promises = userMessages.map(msg => 
        apiRequest(`/api/contact?id=${msg.id}`, {
          method: 'DELETE'
        })
      );
      
      await Promise.all(promises);
      await fetchMessages(false);
      toast.success(`Deleted ${userMessages.length} messages`);
    } catch (error) {
      toast.error('Failed to delete messages');
    }
  };

  // Delete single message
  const handleDeleteSingleMessage = async (messageId: string) => {
    if (!confirm('Delete this message?')) {
      return;
    }
    
    try {
      await apiRequest(`/api/contact?id=${messageId}`, {
        method: 'DELETE'
      });
      
      await fetchMessages(false);
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  // Delete all messages
  const handleDeleteAllMessages = async () => {
    if (messages.length === 0) return;
    
    if (!confirm(`Delete all ${messages.length} messages? This cannot be undone.`)) {
      return;
    }
    
    try {
      const promises = messages.map(msg => 
        apiRequest(`/api/contact?id=${msg.id}`, {
          method: 'DELETE'
        })
      );
      
      await Promise.all(promises);
      await fetchMessages(false);
      toast.success(`Deleted all ${messages.length} messages`);
    } catch (error) {
      toast.error('Failed to delete messages');
    }
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success('Email copied to clipboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    setMessages([]);
    toast.info('Logged out successfully');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  // Show loading while not mounted (SSR phase)
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // ==================== LOGIN SCREEN ====================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Login</h1>
                <p className="text-muted-foreground mt-2">
                  Enter admin password to view messages
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  className="bg-background h-12 text-lg"
                />
              </div>

              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {authError}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleLogin} 
                className="w-full h-12 text-lg bg-primary hover:bg-primary/90"
                size="lg"
              >
                Login
              </Button>

              <div className="text-center pt-4 border-t">
                <a
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  ← Back to Home
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ==================== MESSAGES SCREEN ====================
  const groupedMessages = groupMessagesByUser(messages);
  const totalUnread = groupedMessages.reduce((sum, group) => sum + group.unreadCount, 0);
  const hasUnreadMessages = totalUnread > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                  <p className="text-sm text-muted-foreground">
                    {groupedMessages.length} conversation{groupedMessages.length !== 1 ? 's' : ''} • {totalUnread} unread message{totalUnread !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              {hasUnreadMessages && (
                <Badge className="bg-primary text-primary-foreground animate-pulse">
                  {totalUnread} new
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchMessages(true)}
                className="gap-2"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              {hasUnreadMessages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="gap-2"
                >
                  <Check className="h-4 w-4" />
                  Mark All Read
                </Button>
              )}
              
              {messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteAllMessages}
                  className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete All
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className="gap-2"
                title={autoRefreshEnabled ? "Auto-refresh enabled" : "Auto-refresh disabled"}
              >
                <Clock className="h-4 w-4" />
                {autoRefreshEnabled ? 'Auto: On' : 'Auto: Off'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages List */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading && messages.length === 0 ? (
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="text-center space-y-4">
              <RefreshCw className="h-12 w-12 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        ) : groupedMessages.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">No messages yet</h2>
              <p className="text-muted-foreground mb-4">
                When visitors fill out the contact form, their messages will appear here.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Auto-refresh: {autoRefreshEnabled ? 'On' : 'Off'}</span>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="mb-6 p-4 bg-muted/50 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{groupedMessages.length} conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{messages.length} total messages</span>
                </div>
                {hasUnreadMessages && (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">{totalUnread} unread</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {autoRefreshEnabled && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Live updating</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {groupedMessages.map((group) => {
                const userKey = `${group.name.toLowerCase()}_${group.email.toLowerCase()}`;
                const hasUnread = group.unreadCount > 0;
                
                return (
                  <Card
                    key={userKey}
                    className={`bg-card border-border transition-all hover:shadow-md ${
                      hasUnread ? 'border-primary/50 shadow-lg shadow-primary/5' : ''
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-primary/10 rounded-full">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-xl text-foreground">
                                  {group.name}
                                </CardTitle>
                                {group.messages.length > 1 && (
                                  <Badge variant="outline" className="text-xs">
                                    {group.messages.length} messages
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {group.email}
                                </span>
                                <span>•</span>
                                <span>Last: {formatDate(group.latestDate)}</span>
                                {hasUnread && (
                                  <>
                                    <span>•</span>
                                    <Badge className="bg-primary text-primary-foreground text-xs">
                                      {group.unreadCount} unread
                                    </Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Latest message preview */}
                          <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <p className="text-foreground text-sm">
                                {group.latestMessage}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyEmail(group.email)}
                            title="Copy email"
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {hasUnread && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkUserAsRead(userKey)}
                              title="Mark all as read"
                              className="h-8 w-8 p-0"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(userKey)}
                            title="Delete all messages"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {/* Individual messages */}
                    <CardContent>
                      <div className="space-y-3">
                        {group.messages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`p-3 rounded-lg border ${msg.read ? 'bg-background border-border' : 'bg-primary/5 border-primary/20'}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(msg.createdAt)}
                                </span>
                                {!msg.read && (
                                  <>
                                    <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleMarkSingleAsRead(msg.id)}
                                      title="Mark as read"
                                      className="h-6 p-0 px-2 text-xs"
                                    >
                                      <Check className="h-3 w-3 mr-1" />
                                      Mark Read
                                    </Button>
                                  </>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSingleMessage(msg.id)}
                                title="Delete this message"
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-foreground whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
        
        {/* Footer */}
        {groupedMessages.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    Auto-refresh: {autoRefreshEnabled ? 'Every 30 seconds' : 'Disabled'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                    className="h-6 px-2 text-xs"
                  >
                    {autoRefreshEnabled ? 'Turn Off' : 'Turn On'}
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Actions */}
      <div className="fixed bottom-8 right-8 z-50 flex gap-2">
        <Button
          onClick={() => window.location.href = '/'}
          variant="outline"
          className="gap-2 shadow-lg backdrop-blur-sm bg-background/80"
        >
          <LogOut className="h-4 w-4" />
          Back to Portfolio
        </Button>
      </div>
    </div>
  );
}