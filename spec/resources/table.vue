<template>
    <table>
        <tr>
            <th>KEY</th>
            <th>VALUE</th>
        </tr>
        <tr>
            <td>name</td>
            <td>John</td>
        </tr>
        <tr>
            <td>age</td>
            <td>26</td>
        </tr>
    </table>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop} from "vue-di-kit";

@Component({name: 'tab-component'})
export class TableComponent {
    @Prop({})
    public name: string;

    public mounted() {
        Object.defineProperty(this, '_test', { value: 25})
    }
}
</script>

<style lang="sass" scoped>
    $primaryColor: #eeccff;

    body {
        color: #ccc;
        background: $primaryColor;
    }

    p {
        color: $primaryColor;
    }

</style>
