// @ts-check
import React, { useState, useCallback } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Animated from "react-native-reanimated";

// UI Components
import { Button } from "@/components/ui/button";
import { Text as UIText } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";

// Icons
import { ArrowLeft, Check, Clock, FileText, ChevronDown, ChevronUp } from "lucide-react-native";

// Colors
const COLORS = {
  background: "#FFFFFF",
  primary: "#000000",
  secondary: "#333333",
  muted: "#666666",
  pastelGreen: "#98D4BB",
  pastelGreenLight: "#B8E6D4",
  pastelGreenDark: "#7BC4A8",
  border: "#EEEEEE",
  unchecked: "#DDDDDD",
};

// Types matching /api/v1/scout/checklist API response
interface ChecklistRequirement {
  item: string;
  description: string;
  verificationStandard?: string;
}

interface ChecklistRequirements {
  required: ChecklistRequirement[];
  optional?: ChecklistRequirement[];
}

interface ChecklistFees {
  amount: number;
  currency: string;
  note?: string;
}

interface ApiChecklistResponse {
  office: {
    name: string;
    type: string;
    address: string;
    phone: string;
  };
  service: {
    serviceId: string;
    name: { en: string; am: string };
    category: string;
    description: string;
    estimatedProcessingTime: string;
    applicableTo: string;
  };
  requirements: ChecklistRequirements;
  fees: ChecklistFees;
}

// Internal UI types (derived from API response)
interface ChecklistItem {
  id: string;
  name: string;
  description?: string;
  verificationStandard?: string;
  required: boolean;
}

interface ChecklistData {
  id: string;
  serviceName: string;
  estimatedTime: string;
  requirements: string[];
  items: ChecklistItem[];
  fees: { amount: number; currency: string; note?: string };
}

// Mock checklist data based on /api/v1/scout/checklist API response
const getChecklistData = (serviceId: string): ChecklistData => {
  const checklists: Record<string, ChecklistData> = {
    srv_001: {
      id: "srv_001",
      serviceName: "Birth Certificate",
      estimatedTime: "45 minutes",
      requirements: [
        "Parent's ID card",
        "Hospital birth notification",
        "Marriage certificate (if applicable)"
      ],
      items: [
        {
          id: "req_1",
          name: "Parent's National ID",
          description: "Valid Ethiopian National ID card of the parent",
          verificationStandard: "Must be original, not expired",
          required: true,
        },
        {
          id: "req_2",
          name: "Hospital Birth Notification",
          description: "Official birth notification from the hospital",
          verificationStandard: "Must have hospital stamp and signature",
          required: true,
        },
        {
          id: "req_3",
          name: "Blue Background Photos",
          description: "2 passport-sized photos with blue background",
          verificationStandard: "Recent (within 6 months), clear, blue background",
          required: true,
        },
        {
          id: "req_4",
          name: "Marriage Certificate",
          description: "If parents are married",
          verificationStandard: "Original or certified copy",
          required: false,
        }
      ],
      fees: { amount: 50, currency: "ETB", note: "Standard processing fee" },
    },
    srv_002: {
      id: "srv_002",
      serviceName: "ID Card",
      estimatedTime: "30 minutes",
      requirements: [
        "Birth certificate",
        "Proof of address",
        "Passport photos"
      ],
      items: [
        {
          id: "req_1",
          name: "Birth Certificate",
          description: "Original birth certificate",
          verificationStandard: "Must be from Kebele or hospital",
          required: true,
        },
        {
          id: "req_2",
          name: "Proof of Address",
          description: "Utility bill or rental agreement",
          verificationStandard: "Dated within last 3 months",
          required: true,
        },
        {
          id: "req_3",
          name: "Passport Photos",
          description: "4 passport-sized photos",
          verificationStandard: "White background, recent",
          required: true,
        },
        {
          id: "req_4",
          name: "Witness",
          description: "Adult witness with valid ID",
          verificationStandard: "Must know the applicant personally",
          required: true,
        }
      ],
      fees: { amount: 100, currency: "ETB" },
    },
    svc3: {
      id: "svc3",
      serviceName: "ID Cards",
      estimatedTime: "15-20 min",
      requirements: [
        "Proof of identity",
        "Proof of address",
        "Photo",
      ],
      items: [
        {
          id: "item1",
          name: "Proof of Identity",
          description: "Birth certificate or existing ID",
          required: true,
        },
        {
          id: "item2",
          name: "Proof of Address",
          description: "Utility bill or lease agreement",
          required: true,
        },
        {
          id: "item3",
          name: "Photo",
          description: "Photo will be taken on-site",
          required: true,
        },
        {
          id: "item4",
          name: "Payment",
          description: "$25.00 processing fee",
          required: true,
        }
      ],
      fees: { amount: 25, currency: "USD" },
    },
  };

  return (
    checklists[serviceId] || {
      id: serviceId,
      serviceName: "Service",
      estimatedTime: "15-30 min",
      requirements: ["Check with office for specific requirements"],
      items: [
        {
          id: "item1",
          name: "Valid ID",
          description: "Government-issued photo ID",
          required: true,
        },
        {
          id: "item2",
          name: "Application Form",
          description: "Completed application",
          required: true,
        },
        {
          id: "item3",
          name: "Payment",
          description: "Processing fee",
          required: true,
        }
      ],
      fees: { amount: 0, currency: "ETB" },
    }
  );
};

// Checklist Item Component
function ChecklistItemComponent({
  item,
  isChecked,
  onToggle,
}: {
  item: ChecklistItem;
  isChecked: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.checklistItem,
        pressed && styles.checklistItemPressed,
      ]}
    >
      <View style={styles.checklistItemRow}>
        <View
          style={[
            styles.checkbox,
            isChecked && styles.checkboxChecked,
          ]}
        >
          {isChecked && <Icon as={Check} style={styles.checkIcon} />}
        </View>
        <View style={styles.checklistItemContent}>
          <UIText style={[styles.checklistItemName, isChecked && styles.checklistItemNameChecked]}>
            {item.name}
          </UIText>
          {item.description && (
            <UIText style={styles.checklistItemDescription}>
              {item.description}
            </UIText>
          )}
          {item.verificationStandard && (
            <UIText style={styles.verificationStandard}>
              ✓ {item.verificationStandard}
            </UIText>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// Progress Bar Component
function ProgressBar({ progress }: { progress: number }) {
  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
      <UIText style={styles.progressText}>{Math.round(progress * 100)}% Complete</UIText>
    </View>
  );
}

// Summary Card Component
function SummaryCard({ data }: { data: ChecklistData }) {
  return (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Icon as={Clock} style={styles.summaryIcon} />
          </View>
          <View style={styles.summaryInfo}>
            <UIText style={styles.summaryTitle}>Estimated Time</UIText>
            <UIText style={styles.summaryValue}>{data.estimatedTime}</UIText>
          </View>
        </View>
        <View style={styles.summaryDividerVertical} />
        <View style={styles.summaryItem}>
          <View style={styles.summaryIconContainer}>
            <Icon as={FileText} style={styles.summaryIcon} />
          </View>
          <View style={styles.summaryInfo}>
            <UIText style={styles.summaryTitle}>Fee</UIText>
            <UIText style={styles.summaryValue}>{data.fees.currency} {data.fees.amount}</UIText>
          </View>
        </View>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.requirementsSection}>
        <UIText style={styles.requirementsTitle}>Requirements Summary</UIText>
        <View style={styles.requirementsList}>
          {data.requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.requirementBullet} />
              <UIText style={styles.requirementText}>{req}</UIText>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}
        </View>
      </View>
    </Card>
  );
}

// Main Checklist Bottom Sheet Content
export function ChecklistSheetContent({
  serviceId,
  serviceName,
  onComplete,
  onDismiss,
}: {
  serviceId: string;
  serviceName: string;
  onComplete?: () => void;
  onDismiss?: () => void;
}) {
  const checklistData = getChecklistData(serviceId);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const allRequiredChecked = checklistData.items
    .filter((item) => item.required)
    .every((item) => checkedItems.has(item.id));

  const progress = checklistData.items.filter((item) => checkedItems.has(item.id)).length / checklistData.items.length;

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onDismiss} style={styles.backButton}>
          <Icon as={ArrowLeft} style={styles.backIcon} />
        </Pressable>
        <View style={styles.headerTitleContainer}>
          <UIText style={styles.headerTitle} numberOfLines={1}>
            {serviceName}
          </UIText>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <ProgressBar progress={progress} />

        {/* Summary Card */}
        <SummaryCard data={checklistData} />

        {/* Checklist Items */}
        <View style={styles.checklistSection}>
          <UIText style={styles.sectionTitle}>Required Documents</UIText>
          <View style={styles.checklistContainer}>
            {checklistData.items.map((item) => (
              <ChecklistItemComponent
                key={item.id}
                item={item}
                isChecked={checkedItems.has(item.id)}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Action Button */}
      <View style={styles.actionButtonContainer}>
        <Button
          style={[
            styles.completeButton,
            !allRequiredChecked && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!allRequiredChecked}
        >
          <Icon as={FileText} style={styles.completeButtonIcon} />
          <UIText style={styles.completeButtonText}>
            {allRequiredChecked ? "Complete & Continue" : "Complete All Items"}
          </UIText>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.pastelGreenLight,
  },
  backIcon: {
    width: 20,
    height: 20,
    color: COLORS.primary,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  bottomSpacer: {
    height: 120,
  },
  // Progress Bar
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: COLORS.pastelGreenLight,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.pastelGreen,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 8,
    textAlign: "center",
  },
  // Summary Card
  summaryCard: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  summaryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.pastelGreenLight,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryIcon: {
    width: 24,
    height: 24,
    color: COLORS.pastelGreenDark,
  },
  summaryInfo: {
    marginLeft: 12,
  },
  summaryDividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  summaryTitle: {
    fontSize: 12,
    color: COLORS.muted,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
  requirementsSection: {
    marginTop: 4,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  requirementsList: {
    gap: 8,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  requirementBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.pastelGreen,
    marginTop: 6,
    marginRight: 10,
  },
  requirementText: {
    fontSize: 14,
    color: COLORS.secondary,
    flex: 1,
    lineHeight: 20,
  },
  verificationStandard: {
    fontSize: 12,
    color: COLORS.pastelGreenDark,
    fontStyle: "italic",
    marginTop: 4,
  },
  // Checklist Section
  checklistSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primary,
    marginBottom: 12,
  },
  checklistContainer: {
    gap: 8,
  },
  checklistItem: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
  },
  checklistItemPressed: {
    backgroundColor: "#F5F5F5",
  },
  checklistItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.unchecked,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: COLORS.pastelGreen,
    borderColor: COLORS.pastelGreen,
  },
  checkIcon: {
    width: 14,
    height: 14,
    color: COLORS.primary,
  },
  checklistItemContent: {
    flex: 1,
  },
  checklistItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.primary,
  },
  checklistItemNameChecked: {
    color: COLORS.muted,
    textDecorationLine: "line-through",
  },
  checklistItemDescription: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 4,
  },
  // Action Button
  actionButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 32,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 12,
    backgroundColor: COLORS.pastelGreen,
  },
  completeButtonDisabled: {
    backgroundColor: COLORS.unchecked,
  },
  completeButtonIcon: {
    width: 20,
    height: 20,
    color: COLORS.primary,
    marginRight: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary,
  },
});

export default ChecklistSheetContent;
