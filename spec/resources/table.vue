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

@Component({})
export class TableComponent {
    @Prop({})
    public name: string;
}
</script>

<style lang="sass" scoped>
    $primaryColor: #eeccff;

    body {
    $primaryColor: #ccc !global;
    background: $primaryColor;
    }

    p {
    color: $primaryColor;
    }

</style>
