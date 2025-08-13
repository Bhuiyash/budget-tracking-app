import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

type Member = {
  Id: string | number;
  Name: string;
  Job: string;
  Location: string;
  Mobile: string;
  dob: string;
};

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
type MonthlyDataItem = {
   sno: string;
      memberid: number;
      date: string;
      amount: string | number;
      extra:string;
 
};

 
export default function SubmitViewMonthlyScreen() {
      const router = useRouter();
const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState("");
const [type, setType] = useState<'Monthly' | 'Special'>('Monthly');
  const [specialReason, setSpecialReason] = useState('');
   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);
 const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
    //const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
    const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]); // original, untouched
const [filteredMonthlyData, setFilteredMonthlyData] = useState<MonthlyDataItem[]>([]); // shown in UI
 const [typeItems, setTypeItems] = useState([
    { label: "Monthly", value: "Monthly" },
    { label: "Special", value: "Special" },
  ]);
   const [typeOpen, setTypeOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
      const [editingItem, setEditingItem] = useState<MonthlyDataItem | null>(null);
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
      );
      const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
    const monthlyApi="https://script.google.com/macros/s/AKfycbzWVbPQIx2TTvQtm5R96XPGaBnt36r_4Nh9M-e-7QX2p7dOwQZ7we5IjHzcTcM_Cnd8VA/exec";
  // ✅ Fetch member list from Google Apps Script
  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbwzNoO_750155zjMbjqFJRS5IdnAhXJB06Ry4uIc7HWWJVWaTe4AEBYNfqYpAG5Hz8t/exec")
      .then((res) => res.json())
      .then((data: Member[]) => {
        const formatted = data.map((member) => ({
  label: member.Name,
  value: String(member.Id), // 👈 force value to be a string
}));
        setItems(formatted);
    //   .then((data) => {
    //     debugger
    //     console.log(data)
      
    // setMembers(data.members || data); // adjust depending on the structure
    //     setMembers(data);
    //     if (data.length > 0) setSelectedMemberId(data[0].Id);
      })
      .catch((error) => {
        console.error("Failed to load members:", error);
        Alert.alert("Error", "Unable to load member list.");
      });
  }, []);

  // ✅ Submit contribution
  const handleSubmit = async () => {

    debugger
    if (!value || !amount || isNaN(Number(amount))) {
      Alert.alert("Validation Error", "Please enter valid amount and select member.");
      return;
    }
 if (amount=="") {
      Alert.alert("Required", "Please enter an amount.");
      return;
    }
     if (value=="") {
      Alert.alert("Required", "Please enter an amount.");
      return;
    }
    const selectedMember = members.find((m) => m.Id === value);
    // if (!selectedMember) {
    //   Alert.alert("Error", "Selected member not found.");
    //   return;
    // }

  
      const selectedDate = new Date(selectedYear, selectedMonth - 1, 1);

  // Format it as YYYY-MM-DD
  const formattedDate = selectedDate.toISOString().split('T')[0];
    const payload = {
      memberid: value,
     entrydate:formattedDate,
      amount: parseFloat(amount),
      specialreason:specialReason,
    };
alert(payload)
    setLoading(true);
    try {
      const res = await fetch(monthlyApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setLoading(false);
      setAmount("");
      Alert.alert("Success", "Contribution saved successfully!");
    } catch (error) {
      setLoading(false);
      console.error(error);
      Alert.alert("Error", "Failed to submit contribution.");
    }
  };
  useEffect(() => {
      fetchMonthlyData();
    }, []);
  
    const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchMonthlyData();
    }, []);
 

 const handleEdit = (item: MonthlyDataItem) => {
    setEditingItem(item);
    setEditModalVisible(true);
  };
  const fetchMonthlyData = async () => {
    try {
      const res = await fetch(monthlyApi);
      const data = await res.json();
      
      setMonthlyData(data);
      setFilteredMonthlyData(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
    
  }
    const filteredExpenses = filteredMonthlyData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth() + 1 === selectedMonth && itemDate.getFullYear() === selectedYear;
  });
  ;

    return (
    <View style={styles.container}>
       {/* Header */}
          <View style={styles.headerBar}>
            <Text style={styles.pageTitle}>Contribution List</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/add-monthly")}
            >
              <Text style={styles.addButtonText}>+ Add Contribution</Text>
            </TouchableOpacity>
          </View>


 {/* Filter Card */}
    <View style={styles.filterCard}>
      <View style={styles.pickerWrapper}>
        <Text style={styles.filterLabel}>Month</Text>
        <Picker
          selectedValue={selectedMonth}
          style={styles.picker}
          onValueChange={(val) => setSelectedMonth(Number(val))}
        >
          {monthNames.map((name, i) => (
            <Picker.Item key={i} label={name} value={i + 1} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerWrapper}>
        <Text style={styles.filterLabel}>Year</Text>
        <Picker
          selectedValue={selectedYear}
          style={styles.picker}
          onValueChange={(val) => setSelectedYear(Number(val))}
        >
          {[2023, 2024, 2025].map((year) => (
            <Picker.Item key={year} label={`${year}`} value={year} />
          ))}
        </Picker>
      </View>
    </View>

   
      <FlatList
        data={filteredExpenses}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>SNo</Text>
            <Text style={styles.headerCell}>MemId</Text>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Amount</Text>
            <Text style={styles.headerCell}>Extra</Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => handleEdit(item)}
            style={[
              styles.row,
              { backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e6f2ff" },
            ]}
          >
            <Text style={styles.cell}>{item.sno}</Text>
            <Text style={styles.cell}>{item.memberid}</Text>
            <Text style={styles.cell}>{formatDate(item.date)}</Text>
            <Text style={styles.cell}>₹{item.amount}</Text>
            <Text style={styles.cell}>{item.extra}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <View style={[styles.row, { backgroundColor: "#d1ecf1" }]}>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>Total</Text>
            <Text style={styles.cell}></Text>
            <Text style={styles.cell}></Text>
            <Text style={[styles.cell, { fontWeight: "bold" }]}>₹2</Text>
          </View>
        }
      />
       {/* Modal */}
      <Modal visible={editModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Monthly</Text>
  
         <TextInput style={styles.input} value={editingItem?.amount.toString()} keyboardType="numeric" onChangeText={(text) => setEditingItem((prev) => prev && { ...prev, amount: text })} />
                  
           
  
           
  
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={[styles.button, { backgroundColor: "#ccc" }]}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
  
             
            </View>
          </View>
        </View>
      </Modal>
    </View>
    
    
  );
 
}

const styles = StyleSheet.create({
   modalContent: { margin: 20, backgroundColor: "#fff", padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
   buttonRow: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 10 },
  button: { padding: 10, borderRadius: 5 },checkbox: {
    marginRight: 10,
  },picker: {
    height: 54,
    width: "100%",
  }, filterCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 12,
    color: "#555",
    marginBottom: -4,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  container: {
    padding: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    padding: 10,
  },
  headerRow: {
    backgroundColor: "#007AFF",
  },
  headerCell: {
    flex: 1,
    color: "#fff",
    fontWeight: "bold",
  },
  cell: {
    flex: 1,
  },
});