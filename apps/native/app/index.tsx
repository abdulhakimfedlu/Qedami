import { ScrollView, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  Card,
  TextField,
  Avatar,
  Chip,
  Surface,
  Divider,
  Switch,
  Checkbox,
} from 'heroui-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Header } from '@/components/header';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function Home() {
  const insets = useSafeAreaInsets();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  // Theme colors
  const accentForeground = useThemeColor('accent-foreground');
  const dangerForeground = useThemeColor('danger-foreground');

  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className="bg-background"
    >

      {/* ScrollView FIRST so it renders behind the header */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 60, paddingBottom: 32 }}
        className="flex-1"
      >
        <View className="px-4 pt-6 gap-8">
          {/* Hero Section */}
          <View className="gap-2">
            <Text className="text-foreground text-xl font-bold">
              HeroUI Theme Showcase
            </Text>
            <Text className="text-muted text-sm">
              Components auto-adapt to your theme
            </Text>
          </View>

          {/* Buttons Section */}
          <Surface variant="secondary" className="gap-4 rounded-xl p-4">
            <Text className="text-foreground font-semibold">Buttons</Text>
            <View className="gap-3">
              <Button variant="primary">
                <Ionicons name="add" size={18} color={accentForeground} />
                <Button.Label>Primary</Button.Label>
              </Button>
              <Button variant="secondary">
                <Button.Label>Secondary</Button.Label>
              </Button>
              <Button variant="tertiary">
                <Button.Label>Tertiary</Button.Label>
              </Button>
              <Button variant="ghost">
                <Button.Label>Ghost</Button.Label>
              </Button>
              <View className="flex-row gap-3">
                <Button isIconOnly variant="primary" size="sm">
                  <Ionicons name="heart" size={16} color={accentForeground} />
                </Button>
                <Button isIconOnly variant="danger" size="sm">
                  <Ionicons name="trash" size={16} color={dangerForeground} />
                </Button>
              </View>
            </View>
          </Surface>

          {/* Cards Section */}
          <Surface variant="secondary" className="gap-4 rounded-xl p-4">
            <Text className="text-foreground font-semibold">Cards</Text>
            <Card variant="default">
              <Card.Header>
                <Avatar size="md" color="accent" alt="Qedami Demo">
                    <Avatar.Fallback>QD</Avatar.Fallback>
                  </Avatar>
              </Card.Header>
              <Card.Body className="gap-2">
                <Card.Title>Card Title</Card.Title>
                <Card.Description>
                  This card demonstrates HeroUI's default variant with proper
                  spacing and typography.
                </Card.Description>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </Card.Footer>
            </Card>

            <Card variant="tertiary">
              <Card.Body className="gap-2">
                <Card.Title>Tertiary Card</Card.Title>
                <Card.Description>
                  Different variant for visual hierarchy
                </Card.Description>
              </Card.Body>
            </Card>
          </Surface>

          {/* Form Elements */}
          <Surface variant="secondary" className="gap-4 rounded-xl p-4">
            <Text className="text-foreground font-semibold">Form Elements</Text>
            <View className="gap-4">
              <TextField isRequired>
                <TextField.Label>Email</TextField.Label>
                <TextField.Input
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TextField.Description>
                  We'll never share your email
                </TextField.Description>
              </TextField>

              <TextField>
                <TextField.Label>Message</TextField.Label>
                <TextField.Input
                  placeholder="Type your message..."
                  multiline
                  numberOfLines={3}
                />
              </TextField>

              {/* Switch */}
              <View className="flex-row items-center justify-between pt-2">
                <Text className="text-foreground font-medium">
                  Enable notifications
                </Text>
                <Switch
                  isSelected={isEnabled}
                  onSelectedChange={setIsEnabled}
                />
              </View>

              {/* Checkbox */}
              <View className="flex-row items-center gap-3 pt-2">
                <Checkbox
                  isSelected={isChecked}
                  onSelectedChange={setIsChecked}
                />
                <Text className="text-foreground flex-1">
                  I agree to the terms
                </Text>
              </View>
            </View>
          </Surface>

          {/* Chips & Avatars */}
          <Surface variant="secondary" className="gap-4 rounded-xl p-4">
            <Text className="text-foreground font-semibold">
              Chips & Avatars
            </Text>
            <View className="gap-4">
              <View className="flex-row flex-wrap gap-2">
                <Chip variant="primary" color="accent">
                  <Ionicons name="star" size={12} />
                  <Chip.Label>Featured</Chip.Label>
                </Chip>
                <Chip variant="secondary" color="success">
                  <Chip.Label>Success</Chip.Label>
                </Chip>
                <Chip variant="tertiary" color="warning">
                  <Chip.Label>Warning</Chip.Label>
                </Chip>
                <Chip variant="soft" color="danger">
                  <Chip.Label>Danger</Chip.Label>
                </Chip>
              </View>

              <Divider />

              <View className="flex-row gap-3 items-center justify-center">
                <Avatar size="sm" color="accent" alt="Avatar Small">
                   <Avatar.Fallback>AC</Avatar.Fallback>
                 </Avatar>
                 <Avatar size="md" color="success" alt="Avatar Medium">
                   <Avatar.Fallback>SC</Avatar.Fallback>
                 </Avatar>
                 <Avatar size="lg" color="danger" alt="Avatar Large">
                   <Avatar.Fallback>DG</Avatar.Fallback>
                 </Avatar>
              </View>
            </View>
          </Surface>

          {/* Surface Variants */}
          <Surface variant="secondary" className="gap-4 rounded-xl p-4">
            <Text className="text-foreground font-semibold">
              Surface Variants
            </Text>
            <View className="gap-3">
              <Surface variant="default" className="p-3 rounded-lg">
                <Text className="text-foreground">Default Surface</Text>
                <Text className="text-muted text-xs mt-1">
                  Primary background level
                </Text>
              </Surface>

              <Surface variant="secondary" className="p-3 rounded-lg">
                <Text className="text-foreground">Secondary Surface</Text>
                <Text className="text-muted text-xs mt-1">
                  Secondary background level
                </Text>
              </Surface>

              <Surface variant="tertiary" className="p-3 rounded-lg">
                <Text className="text-foreground">Tertiary Surface</Text>
                <Text className="text-muted text-xs mt-1">
                  Tertiary background level
                </Text>
              </Surface>

              <Surface variant="transparent" className="p-3 rounded-lg border border-border">
                <Text className="text-foreground">Transparent Surface</Text>
                <Text className="text-muted text-xs mt-1">
                  No background fill
                </Text>
              </Surface>
            </View>
          </Surface>

          {/* Button Sizes & Variants */}
          <Surface variant="secondary" className="gap-4 rounded-xl p-4">
            <Text className="text-foreground font-semibold">
              Button Sizes
            </Text>
            <View className="gap-2">
              <Button size="sm" variant="primary">
                Small Button
              </Button>
              <Button size="md" variant="primary">
                Medium Button
              </Button>
              <Button size="lg" variant="primary">
                Large Button
              </Button>
            </View>

            <Divider className="my-2" />

            <Text className="text-foreground font-semibold">
              Danger Variants
            </Text>
            <View className="gap-2">
              <Button variant="danger">Danger</Button>
              <Button variant="danger-soft">Danger Soft</Button>
            </View>
          </Surface>

          {/* Info Section */}
          <Card variant="default" className="border border-focus">
            <Card.Body className="gap-3">
              <View className="flex-row gap-3">
                <View className="w-10 h-10 rounded-full bg-focus items-center justify-center">
                  <Ionicons name="information-circle" size={20} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Card.Title>Theme System Active</Card.Title>
                  <Card.Description>
                    All colors are automatically synchronized with your theme
                    settings. Switch between light and dark modes to see the
                    changes in real-time.
                  </Card.Description>
                </View>
              </View>
            </Card.Body>
          </Card>
        </View>
      </ScrollView>

      <Header />
    </View>
  );
}
