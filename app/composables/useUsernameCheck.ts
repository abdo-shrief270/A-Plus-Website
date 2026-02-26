import { ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { authService } from "@/services/api/auth.service";

export function useUsernameCheck() {
  const status = ref<"idle" | "available" | "taken">("idle");
  const loading = ref(false);

  const checkUsernameDebounced = useDebounceFn(async (username: string) => {
    loading.value = true;
    try {
      const res = await authService.checkUsername(username);
      const isAvailable =
        res.data?.data?.available ?? res.data?.available ?? true;
      status.value = isAvailable ? "available" : "taken";
    } catch (error) {
      status.value = "idle";
      console.error("Username check failed:", error);
    } finally {
      loading.value = false;
    }
  }, 500);

  const checkUsername = (username: string | undefined) => {
    if (!username || username.trim().length < 3) {
      status.value = "idle";
      loading.value = false;
      return;
    }

    // Immediately show loading if taking time, or keep it idle until debounced triggers
    status.value = "idle";
    checkUsernameDebounced(username.trim());
  };

  return {
    status,
    loading,
    checkUsername,
  };
}
