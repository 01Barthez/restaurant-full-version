
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MailOpen, Search, Trash2, Reply } from 'lucide-react';
import useStore from '@/store/useStore';
import { useToast } from '@/hooks/use-toast';

const MessagesManagement: React.FC = () => {
  const { contactMessages, markMessageAsRead } = useStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = contactMessages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsRead = (messageId: string) => {
    markMessageAsRead(messageId);
    toast({
      title: "Message marqué comme lu",
      description: "Le message a été marqué comme lu.",
    });
  };

  const handleReply = (message: any) => {
    setSelectedMessage(message);
    setReplyText(`Bonjour ${message.name},\n\nMerci pour votre message. `);
    if (!message.read) {
      markMessageAsRead(message.id);
    }
  };

  const sendReply = () => {
    toast({
      title: "Réponse envoyée",
      description: `Réponse envoyée à ${selectedMessage.email}`,
    });
    setSelectedMessage(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Messages Management
        </h2>
        <Badge variant="outline">
          {contactMessages.length} Total Messages
        </Badge>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Messages ({filteredMessages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    !message.read 
                      ? 'border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20' 
                      : 'border-gray-200 dark:border-gray-700'
                  } ${
                    selectedMessage?.id === message.id 
                      ? 'ring-2 ring-orange-500' 
                      : ''
                  }`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {message.name}
                        </h4>
                        {!message.read && (
                          <Badge variant="default" className="bg-orange-500">
                            <Mail className="w-3 h-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {message.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {!message.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(message.id);
                          }}
                        >
                          <MailOpen className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(message);
                        }}
                      >
                        <Reply className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {message.message}
                  </p>
                </div>
              ))}
              
              {filteredMessages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Detail & Reply */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedMessage ? 'Message Detail & Reply' : 'Select a Message'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {selectedMessage.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedMessage.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedMessage.timestamp).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    {!selectedMessage.read && (
                      <Badge variant="default" className="bg-orange-500">New</Badge>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedMessage.message}
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    Reply to {selectedMessage.name}
                  </h5>
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button onClick={sendReply} className="flex-1">
                      <Reply className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedMessage(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a message to view details and reply</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesManagement;
