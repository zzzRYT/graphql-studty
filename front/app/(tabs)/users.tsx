import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { CREATE_USER, GET_USERS } from '@/lib/graphql/queries';
import { useMutation, useQuery } from '@apollo/client/react';

type User = {
  id: string;
  name: string;
  age: number;
  isMarried: boolean;
};

export default function UsersScreen() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  const [createUser, { loading: creating }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    update: (cache, { data: mutationData }) => {
      const existingData = cache.readQuery({ query: GET_USERS });
      if (existingData && mutationData?.createUser) {
        cache.writeQuery({
          query: GET_USERS,
          data: {
            getUsers: [...existingData.getUsers, mutationData.createUser],
          },
        });
      }
    },
    onCompleted: () => {
      setName('');
      setAge('');
      setIsMarried(false);
    },
  });

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isMarried, setIsMarried] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#ccc', dark: '#444' }, 'text');

  const handleCreateUser = async () => {
    if (!name.trim() || !age.trim()) return;
    await createUser({
      variables: {
        name: name.trim(),
        age: parseInt(age, 10),
        isMarried,
      },
    });
  };

  const renderUser = ({ item }: { item: User }) => (
    <ThemedView style={[styles.userCard, { borderColor }]}>
      <ThemedText type="subtitle">{item.name}</ThemedText>
      <ThemedText>Age: {item.age}</ThemedText>
      <ThemedText>Married: {item.isMarried ? 'Yes' : 'No'}</ThemedText>
    </ThemedView>
  );

  if (loading) {
    return (
      <ThemedView style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText>Loading users...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.centered}>
        <ThemedText type="subtitle">Error</ThemedText>
        <ThemedText>{error.message}</ThemedText>
        <Pressable style={styles.button} onPress={() => refetch()}>
          <ThemedText style={styles.buttonText}>Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.header}>
        Users
      </ThemedText>

      <ThemedView style={[styles.form, { borderColor }]}>
        <ThemedText type="subtitle">Add New User</ThemedText>
        <TextInput
          style={[styles.input, { borderColor, color: textColor }]}
          placeholder="Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, { borderColor, color: textColor }]}
          placeholder="Age"
          placeholderTextColor="#999"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <View style={styles.switchRow}>
          <ThemedText>Married:</ThemedText>
          <Switch value={isMarried} onValueChange={setIsMarried} />
        </View>
        <Pressable
          style={[
            styles.button,
            (creating || !name || !age) && styles.buttonDisabled,
          ]}
          onPress={handleCreateUser}
          disabled={creating || !name || !age}
        >
          <ThemedText style={styles.buttonText}>
            {creating ? 'Creating...' : 'Create User'}
          </ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedText type="subtitle" style={styles.listHeader}>
        User List ({data?.getUsers?.length || 0})
      </ThemedText>

      <FlatList
        data={data?.getUsers || []}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<ThemedText>No users found</ThemedText>}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  header: {
    marginBottom: 20,
  },
  form: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listHeader: {
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  userCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    gap: 4,
  },
});
