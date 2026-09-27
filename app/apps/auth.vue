<script setup lang="ts">
</script>

<template>
    <div class="content">
        <h1>log in with hack club auth first</h1>
        <form action="/oauth" method="get">
            <input id="email" name="login_hint" type="email" placeholder="enter your email here"
                pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$" required>
            <input type="submit" value="Authorize" />
        </form>
    </div>
</template>

<style scoped>
.content {
    padding: 10px;
    gap: 5px;

    display: flex;
    flex-direction: column;

    h1 {
        margin: 0;
    }

    input[type="submit"] {
        width: 200px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
}
</style>