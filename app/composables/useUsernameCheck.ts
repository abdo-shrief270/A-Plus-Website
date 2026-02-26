import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { authService } from "@/services/api/auth.service";

export function useUsernameCheck() {
  const status = ref<"idle" | "available" | "taken">("idle");
  const loading = ref(false);

  // Track the most recent requested username so a stale debounce doesn't overwrite an empty state
  const currentCheckUsername = ref("");

  const checkUsernameDebounced = useDebounceFn(async (username: string) => {
    // If the input was cleared while we were waiting to debounce, do nothing
    if (currentCheckUsername.value !== username || username.trim().length < 3) {
      return;
    }

    loading.value = true;
    try {
      const res = await authService.checkUsername(username);
      // Double check it hasn't changed while the API call was happening
      if (currentCheckUsername.value === username) {
        const isAvailable =
          res.data?.data?.available ?? res.data?.available ?? true;
        status.value = isAvailable ? "available" : "taken";
      }
    } catch (error) {
      if (currentCheckUsername.value === username) {
        status.value = "idle";
      }
      console.error("Username check failed:", error);
    } finally {
      if (currentCheckUsername.value === username) {
        loading.value = false;
      }
    }
  }, 500);

  const checkUsername = (username: string | undefined) => {
    const rawUsername = username || "";
    currentCheckUsername.value = rawUsername.trim();

    if (currentCheckUsername.value.length < 3) {
      status.value = "idle";
      loading.value = false;
      return;
    }

    // Immediately show loading if taking time, or keep it idle until debounced triggers
    status.value = "idle";
    checkUsernameDebounced(currentCheckUsername.value);
  };

  return {
    status,
    loading,
    checkUsername,
  };
}
