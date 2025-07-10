// HomePage.tsx
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import {
  Chat as ChatIcon,
  AccountTree as WorkflowIcon,
  Build as ToolsIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { trpc } from "../lib/api/trpc/trpc";

export default function HomePage() {
  const navigate = useNavigate();
  const { data: user, isLoading: userLoading } = trpc.user.me.useQuery();
  const { data: organization, isLoading: orgLoading } = trpc.organization.getOrganization.useQuery();
  const { data: productConfig } = trpc.productConfig.get.useQuery();
  const recentChats = [] as any[]; // Mock empty array for demo

  if (userLoading || orgLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress />
          <Typography variant="h6">Loading dashboard...</Typography>
        </Box>
      </Container>
    );
  }

  const quickActions = [
    {
      title: "Start New Chat",
      description: "Begin a conversation with AI",
      icon: ChatIcon,
      color: "primary",
      action: () => navigate("/chat"),
    },
    {
      title: "Explore Workflows",
      description: "Create and manage AI workflows",
      icon: WorkflowIcon,
      color: "success",
      action: () => navigate("/workflows"),
    },
    {
      title: "AI Tools",
      description: "Access specialized AI tools",
      icon: ToolsIcon,
      color: "warning",
      action: () => navigate("/tools"),
    },
  ];

  const features = [
    { name: "Image Generation", enabled: productConfig?.imageGeneration },
    { name: "Meeting Tools", enabled: productConfig?.meetingSummarizer },
    { name: "Personal Assistant", enabled: productConfig?.personalAssistant },
    { name: "Document Analysis", enabled: true },
    { name: "Code Generation", enabled: true },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Welcome to DeinGPT
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Your AI-powered productivity platform
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        {quickActions.map((action, index) => (
          <Box sx={{ flex: 1 }} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                }
              }}
              onClick={action.action}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${action.color}.main` }}>
                    <action.icon />
                  </Avatar>
                  <Typography variant="h6" component="h2">
                    {action.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color={action.color as any}>
                  Get Started
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>

      {/* Dashboard Cards */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* User Information */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6">User Profile</Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemText primary="Name" secondary={user?.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Email" secondary={user?.email} />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={user?.onboarded ? "Active" : "Pending"} 
                        color={user?.onboarded ? "success" : "warning"}
                        size="small"
                      />
                    } 
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>

          {/* Organization */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  <BusinessIcon />
                </Avatar>
                <Typography variant="h6">Organization</Typography>
              </Box>
              <List dense>
                <ListItem>
                  <ListItemText primary="Name" secondary={organization?.name} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Title" secondary={organization?.customTitle} />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip 
                        label={organization?.phaseStatus === 'ok' ? "Active" : "Inactive"} 
                        color={organization?.phaseStatus === 'ok' ? "success" : "error"}
                        size="small"
                      />
                    } 
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>

          {/* Features */}
          <Box sx={{ flex: 1 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckIcon />
                </Avatar>
                <Typography variant="h6">Available Features</Typography>
              </Box>
              <List dense>
                {features.map((feature, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckIcon 
                        color={feature.enabled ? "success" : "disabled"} 
                        fontSize="small"
                      />
                    </ListItemIcon>
                    <ListItemText 
                      primary={feature.name}
                      secondary={feature.enabled ? "Enabled" : "Disabled"}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </Box>

        {/* Recent Activity */}
        <Paper elevation={1} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {recentChats && recentChats.length > 0 ? (
            <List>
              {recentChats.slice(0, 5).map((chat: any) => (
                <ListItem key={chat.id} divider>
                  <ListItemIcon>
                    <ChatIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={chat.title}
                    secondary={`Created: ${new Date(chat.createdAt).toLocaleString()}`}
                  />
                  <Button
                    size="small"
                    onClick={() => navigate(`/chat?id=${chat.id}`)}
                  >
                    Open
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent activity. Start a new chat to get going!
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 