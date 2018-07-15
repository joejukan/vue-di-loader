<template>
    <form>
        <label>Email Address</label>
        <input v-model="email" placeholder="Email Address"/>
    </form>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-di-kit";

@Component()
export class LoginComponent {
    @Prop({type: String})
    public email;

}
</script>

<style lang="sass">
input {
    margin-bottom: 20px;
}
</style>
