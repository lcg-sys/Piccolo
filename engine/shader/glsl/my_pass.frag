#version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(location = 0) out highp vec4 out_color;

highp vec3 Uncharted2Tonemap(highp vec3 x);

void main()
{
    highp vec3 color = subpassLoad(in_color).rgb;

    highp float red = 1.0 - color.r;
    highp float green = 1.0 - color.g;
    highp float blue = 1.0 - color.b;

    out_color = vec4(red, green, blue, 1.0f);
    // out_color = vec4(color, 1.0);
}

