import React from "react";
import { View, ScrollView, StyleSheet, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";

// UI Components
import { Button } from "@/components/ui/button";
import { Text as UIText } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

// Reacticx
import { useBottomSheet } from "@/components/ui/templates/bottom-sheet-stack";
import BottomSheet from "@/components/ui/templates/bottom-sheet";
import { ChecklistSheetContent } from "@/components/ui/templates/checklist-sheet";

// Icons
import { MapPin, Clock, Navigation, CheckCircle, ChevronRight, Phone, Globe } from "lucide-react-native";

// Constants
const COLORS = {
  background: "#FFFFFF",
  primary: "#000000",
  secondary: "#333333",
  muted: "#666666",
  pastelGreen: "#98D4BB",
  pastelGreenLight: "#B8E6D4",
  pastelGreenDark: "#7BC4A8",
};

// Mock data
const MOCK_OFFICE_DATA = {
  _id: "65b3a...",
  name: "Kirkos Kebele 05",
  type: "Kebele",
  jurisdiction: "Addis Ababa",
  location: [38.7635, 9.0100] as [number, number],
  address: {
    region: "Addis Ababa",
    subcity: "Kirkos",
    woreda: "08",
    kebeleNumber: "05",
    landmark: "Opposite St. Urael Church",
    directions: {
      en: "Behind the police station",
      am: "የፖሊስ ማዘውተሪያው በኋላ"
    }
  },
  contact: {
    phone: "011 234 5678",
    email: "kirkos05@addis.gov.et",
    website: ""
  },
  operatingHours: {
    monday: { open: "08:30", close: "17:30", isOpen: true },
    tuesday: { open: "08:30", close: "17:30", isOpen: true },
    wednesday: { open: "08:30", close: "17:30", isOpen: true },
    thursday: { open: "08:30", close: "17:30", isOpen: true },
    friday: { open: "08:30", close: "11:30", isOpen: true, note: "Half day" },
    saturday: { isOpen: false, open: "", close: "" },
    sunday: { isOpen: false }
  },
  services: [
    {
      serviceId: "srv_001",
      name: { en: "Birth Certificate", am: "የወሊድ ሰርቲፊኬት" },
      isAvailable: true,
      typicalWaitTime: "45 minutes",
      operationalNotes: {
        en: "Blue background photos required. Arrive before 11 AM.",
        am: "ሰማያዊ ባክግራውንድ ፎቶዎች ያስፈልጋሉ። ከጠዋቱ 11 ሰዓት በፊት ይምጡ።"
      }
    },
    {
      serviceId: "srv_002",
      name: { en: "ID Card", am: "የመታወቂያ ካርድ" },
      isAvailable: true,
      typicalWaitTime: "30 minutes"
    },
    {
      serviceId: "srv_003",
      name: { en: "Residence Certificate", am: "የመኖሪያ ማረጋገጫ" },
      isAvailable: false,
      operationalNotes: {
        en: "Service suspended for system upgrade",
        am: "አገልግሎቱ ለስርዓት ማሻገር ተቋርጧል"
      }
    }
  ],
  lastVerifiedAt: "2024-01-20T00:00:00Z"
};

export interface Service {
  serviceId: string;
  name: { en: string; am: string };
  isAvailable: boolean;
  typicalWaitTime?: string;
  operationalNotes?: { en: string; am: string };
}

export interface DetailsSheetContentProps {
  officeId: string;
  officeName?: string;
}

function OfficeInfoSection({ office }: { office: typeof MOCK_OFFICE_DATA }) {
  const isOpen = true;
  const formattedAddress = `${office.address.subcity} ${office.address.kebeleNumber ? `, Kebele ${office.address.kebeleNumber}` : ""}${office.address.landmark ? `, ${office.address.landmark}` : ""}`;
  
  return (
    <Card style={styles.officeInfoCard}>
      <View style={styles.officeHeader}>
        <View style={styles.officeTypeBadge}>
          <UIText style={styles.officeTypeText}>{office.type}</UIText>
        </View>
        <View style={[styles.openBadge, isOpen && styles.openBadgeActive]}>
          <UIText style={[styles.openBadgeText, isOpen && styles.openBadgeTextActive]}>
            {isOpen ? "Open" : "Closed"}
          </UIText>
        </View>
      </View>
      
      <UIText style={styles.officeName}>{office.name}</UIText>
      <UIText style={styles.jurisdictionText}>{office.jurisdiction}</UIText>

      <View style={styles.infoRow}>
        <Icon as={MapPin} style={styles.infoIcon} />
        <UIText style={styles.infoText}>{formattedAddress}</UIText>
      </View>

      <View style={styles.contactRow}>
        <View style={styles.contactItem}>
          <Icon as={Phone} style={styles.contactIcon} />
          <UIText style={styles.contactText}>{office.contact.phone}</UIText>
        </View>
        {office.contact.email && (
          <View style={styles.contactItem}>
            <Icon as={Globe} style={styles.contactIcon} />
            <UIText style={styles.contactText}>{office.contact.email}</UIText>
          </View>
        )}
      </View>
    </Card>
  );
}

function HoursSection({ operatingHours }: { operatingHours: typeof MOCK_OFFICE_DATA.operatingHours }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const todayHours = operatingHours[today as keyof typeof operatingHours];
  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  
  const formatTime = (hours: any) => {
    if (!hours || !hours.isOpen) return "Closed";
    return `${hours.open} - ${hours.close}`;
  };

  return (
    <View style={styles.hoursSection}>
      <UIText style={styles.sectionTitle}>Operating Hours</UIText>
      <Card style={styles.hoursCard}>
        <View style={styles.todayRow}>
          <UIText style={styles.todayLabel}>Today ({today.charAt(0).toUpperCase() + today.slice(1)})</UIText>
          <UIText style={styles.todayHours}>{formatTime(todayHours)}</UIText>
        </View>
        <View style={styles.hoursDivider} />
        <View style={styles.hoursList}>
          {dayOrder.map((day) => {
            const dayHours = operatingHours[day as keyof typeof operatingHours];
            const isToday = day === today;
            return (
              <View key={day} style={[styles.hoursRow, isToday && styles.todayHoursRow]}>
                <UIText style={[styles.dayText, isToday && styles.todayDayText]}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </UIText>
                <UIText style={[styles.dayHoursText, isToday && styles.todayDayHoursText]}>
                  {formatTime(dayHours)}
                </UIText>
              </View>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

function ServiceItem({ service, onPress }: { service: Service; onPress: (service: Service) => void }) {
  return (
    <Pressable
      onPress={() => onPress(service)}
      style={({ pressed }) => [styles.serviceItem, pressed && styles.serviceItemPressed]}
    >
      <Card style={styles.serviceCard}>
        <View style={styles.serviceHeader}>
          <View style={styles.serviceInfo}>
            <UIText style={styles.serviceName}>{service.name.en}</UIText>
            {service.operationalNotes && (
              <UIText style={styles.serviceNote}>{service.operationalNotes.en}</UIText>
            )}
          </View>
          <View style={styles.serviceAvailability}>
            {service.isAvailable ? (
              <View style={styles.availableBadge}>
                <UIText style={styles.availableText}>Available</UIText>
              </View>
            ) : (
              <View style={styles.unavailableBadge}>
                <UIText style={styles.unavailableText}>Unavailable</UIText>
              </View>
            )}
            <Icon as={ChevronRight} style={styles.serviceChevron} />
          </View>
        </View>
        {service.typicalWaitTime && (
          <View style={styles.serviceFooter}>
            <View style={styles.serviceMeta}>
              <Icon as={Clock} style={styles.serviceMetaIcon} />
              <UIText style={styles.serviceMetaText}>Wait: {service.typicalWaitTime}</UIText>
            </View>
          </View>
        )}
      </Card>
    </Pressable>
  );
}

export function DetailsSheetContent({ officeId, officeName }: DetailsSheetContentProps) {
  const { present } = useBottomSheet();
  
  // Mock fetching office data
  const office = { ...MOCK_OFFICE_DATA, _id: officeId };

  const handleServicePress = (service: Service) => {
    present(
      <BottomSheet snapPoints={["85%"]}>
        <ChecklistSheetContent
          serviceId={service.serviceId}
          serviceName={service.name.en}
          onComplete={() => console.log("Checklist completed")}
          onDismiss={() => {}}
        />
      </BottomSheet>
    );
  };

  const handleStartService = () => {
    const firstService = office.services[0];
    if (firstService) handleServicePress(firstService);
  };

  const handleDirections = async () => {
    const address = `${office.address.subcity}, Kebele ${office.address.kebeleNumber}`;
    const encodedAddress = encodeURIComponent(address);
    const url = `maps:0,0?q=${encodedAddress}`;
    try {
      if (await Linking.canOpenURL(url)) await Linking.openURL(url);
      else await Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <OfficeInfoSection office={office} />
        <HoursSection operatingHours={office.operatingHours} />
        <View style={styles.servicesSection}>
          <UIText style={styles.sectionTitle}>Available Services</UIText>
          <View style={styles.servicesList}>
            {office.services.map((service) => (
              <ServiceItem key={service.serviceId} service={service} onPress={handleServicePress} />
            ))}
          </View>
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.actionButtonsContainer}>
        <Button variant="outline" style={styles.directionsButton} onPress={handleDirections}>
          <Icon as={Navigation} style={styles.buttonIcon} />
          <UIText style={styles.directionsButtonText}>Directions</UIText>
        </Button>
        <Button style={styles.startButton} onPress={handleStartService}>
          <Icon as={CheckCircle} style={styles.startButtonIcon} />
          <UIText style={styles.startButtonText}>Start</UIText>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  bottomSpacer: {
    height: 100,
  },
  officeInfoCard: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginBottom: 20,
  },
  officeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  officeTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: COLORS.pastelGreenLight,
  },
  officeTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },
  officeName: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 4,
  },
  jurisdictionText: {
    fontSize: 14,
    color: COLORS.muted,
    marginBottom: 16,
  },
  openBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
  },
  openBadgeActive: {
    backgroundColor: COLORS.pastelGreen,
  },
  openBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.muted,
  },
  openBadgeTextActive: {
    color: COLORS.primary,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoIcon: {
    width: 16,
    height: 16,
    color: COLORS.muted,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.secondary,
    flex: 1,
  },
  contactRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactIcon: {
    width: 16,
    height: 16,
    color: COLORS.pastelGreen,
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  hoursSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  hoursCard: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  todayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todayLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  todayHours: {
    fontSize: 14,
    color: COLORS.pastelGreenDark,
    fontWeight: "500",
  },
  hoursDivider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 12,
  },
  hoursList: {
    gap: 8,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  todayHoursRow: {
    backgroundColor: COLORS.pastelGreenLight,
    marginHorizontal: -8,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  dayText: {
    fontSize: 13,
    color: COLORS.secondary,
  },
  todayDayText: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  dayHoursText: {
    fontSize: 13,
    color: COLORS.muted,
  },
  todayDayHoursText: {
    fontWeight: "600",
    color: COLORS.pastelGreenDark,
  },
  servicesSection: {
    marginBottom: 24,
  },
  servicesList: {
    gap: 12,
  },
  serviceItem: {
    marginBottom: 0,
  },
  serviceItemPressed: {
    opacity: 0.8,
  },
  serviceCard: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 4,
  },
  serviceNote: {
    fontSize: 12,
    color: "#E53935",
    fontStyle: "italic",
    marginTop: 4,
  },
  serviceAvailability: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  availableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: COLORS.pastelGreen,
  },
  availableText: {
    fontSize: 10,
    fontWeight: "600",
    color: COLORS.primary,
  },
  unavailableBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#FFCDD2",
  },
  unavailableText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#C62828",
  },
  serviceChevron: {
    width: 20,
    height: 20,
    color: COLORS.pastelGreen,
  },
  serviceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceMetaIcon: {
    width: 14,
    height: 14,
    color: COLORS.muted,
    marginRight: 4,
  },
  serviceMetaText: {
    fontSize: 12,
    color: COLORS.muted,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    gap: 12,
  },
  directionsButton: {
    flex: 1,
    borderColor: COLORS.pastelGreen,
    backgroundColor: COLORS.background,
  },
  buttonIcon: {
    width: 18,
    height: 18,
    color: COLORS.pastelGreenDark,
    marginRight: 8,
  },
  directionsButtonText: {
    color: COLORS.pastelGreenDark,
    fontWeight: "600",
  },
  startButton: {
    flex: 1.5,
    backgroundColor: COLORS.pastelGreen,
  },
  startButtonIcon: {
    width: 18,
    height: 18,
    color: COLORS.primary,
    marginRight: 8,
  },
  startButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
  },
});
