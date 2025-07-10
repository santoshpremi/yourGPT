import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Paper,
  Chip,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  AccountTree as WorkflowIcon,
  Build as ToolsIcon,
  School as AcademyIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { trpc } from '../../lib/api/trpc/trpc';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: user } = trpc.user.me.useQuery();
  const { data: organization } = trpc.organization.getOrganization.useQuery();
  // Mock chat creation for demo
  const createChatMutation = { 
    mutateAsync: async (data: any) => ({ id: Date.now().toString(), ...data }),
    isPending: false
  };

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: DashboardIcon },
    { path: '/chat', label: 'Chat', icon: ChatIcon },
    { path: '/workflows', label: 'Workflows', icon: WorkflowIcon },
    { path: '/tools', label: 'AI Tools', icon: ToolsIcon },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleNewChat = async () => {
    try {
      const chat = await createChatMutation.mutateAsync({
        title: 'New Chat',
      });
      navigate(`/chat?id=${chat.id}`);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo and Brand */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          DeinGPT
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI Productivity Platform
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" fontWeight="medium">
                {user?.name || 'Demo User'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {organization?.name || 'Demo Organization'}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Chip
              label={organization?.phaseStatus === 'ok' ? 'Active' : 'Inactive'}
              color={organization?.phaseStatus === 'ok' ? 'success' : 'default'}
              size="small"
            />
          </Box>
        </Paper>
      </Box>

      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          fullWidth
          onClick={handleNewChat}
          disabled={createChatMutation.isPending}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            py: 1.5,
          }}
        >
          {createChatMutation.isPending ? 'Creating...' : 'New Chat'}
        </Button>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ px: 1 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  <item.icon />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 'medium' : 'regular',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Additional Features */}
        <List sx={{ px: 1 }}>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                <AcademyIcon />
              </ListItemIcon>
              <ListItemText primary="Academy" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemIcon sx={{ color: 'text.secondary' }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="caption" color="text.secondary" display="block">
          DeinGPT v1.0.0
        </Typography>
        <Typography variant="caption" color="text.secondary">
          © 2024 DeinGPT Team
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar; 